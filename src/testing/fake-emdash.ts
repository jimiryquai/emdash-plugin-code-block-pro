import { createDatabase } from "../../node_modules/emdash/src/database/connection.js";
import { runMigrations } from "../../node_modules/emdash/src/database/migrations/runner.js";
import { SchemaRegistry } from "../../node_modules/emdash/src/schema/registry.js";
import { EmDashRuntime } from "../../node_modules/emdash/src/emdash-runtime.js";

export interface FakeCollectionConfig {
	slug: string;
	label: string;
	supports?: string[];
	fields?: Array<{
		slug: string;
		label: string;
		type: string;
		required?: boolean;
		unique?: boolean;
	}>;
}

export interface FakeSchemaConfig {
	collections: FakeCollectionConfig[];
	plugins?: any[];
}

export class FakeEmDashContext {
	public db: any;
	public runtime!: EmDashRuntime;

	constructor(db: any) {
		this.db = db;
	}

	/**
	 * Define the collections and fields schema in the database, and instantiate
	 * the EmDashRuntime.
	 */
	async defineSchema(config: FakeSchemaConfig) {
		const registry = new SchemaRegistry(this.db);

		for (const col of config.collections) {
			await registry.createCollection({
				slug: col.slug,
				label: col.label,
				supports: col.supports ?? [],
			});

			if (col.fields) {
				for (const field of col.fields) {
					await registry.createField(col.slug, {
						slug: field.slug,
						label: field.label,
						type: field.type as any,
						required: field.required ?? false,
						unique: field.unique ?? false,
					});
				}
			}
		}

		// Set up mock hook pipeline
		const mockHooks = {
			hasHooks: () => false,
			runContentBeforeSave: async (data: any) => ({ content: data }),
			setContextFactory: () => {},
		};

		// Instantiate runtime
		this.runtime = new EmDashRuntime({
			db: this.db,
			storage: null,
			configuredPlugins: config.plugins ?? [],
			sandboxedPlugins: new Map(),
			sandboxedPluginEntries: [],
			hooks: mockHooks as any,
			enabledPlugins: new Set(),
			pluginStates: new Map(),
			config: {} as any,
			mediaProviders: new Map(),
			mediaProviderEntries: [],
			cronExecutor: null,
			cronScheduler: null,
			emailPipeline: null,
			allPipelinePlugins: [],
			pipelineFactoryOptions: { db: this.db },
			runtimeDeps: {} as any,
			pipelineRef: { current: mockHooks as any },
		});
	}

	/**
	 * Seed initial records into a collection's database table.
	 */
	async seed(collection: string, items: Array<Record<string, any>>) {
		const tableName = `ec_${collection}`;
		for (const item of items) {
			await this.db.insertInto(tableName)
				.values(item)
				.execute();
		}
	}

	/**
	 * Execute a content update (simulates saving a draft/revision via runtime).
	 */
	async save(collection: string, id: string, body: any) {
		if (!this.runtime) {
			throw new Error("Schema has not been defined yet! Call defineSchema() first.");
		}
		return this.runtime.handleContentUpdate(collection, id, body);
	}

	/**
	 * Query a content entry directly from the database table.
	 */
	async getEntry(collection: string, id: string) {
		const tableName = `ec_${collection}`;
		return this.db.selectFrom(tableName)
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}

	/**
	 * Get revisions for a given content entry.
	 */
	async getRevisions(entryId: string) {
		return this.db.selectFrom("revisions")
			.selectAll()
			.where("entry_id", "=", entryId)
			.execute();
	}

	/**
	 * Tear down the database connection.
	 */
	async destroy() {
		if (this.db) {
			await this.db.destroy();
		}
	}
}

export class FakeEmDash {
	/**
	 * Create and initialize an in-memory SQLite EmDash context.
	 */
	static async createContext(): Promise<FakeEmDashContext> {
		const db = createDatabase({ url: ":memory:" });
		await runMigrations(db);
		return new FakeEmDashContext(db);
	}
}
