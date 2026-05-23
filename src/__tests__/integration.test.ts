import { describe, it, expect } from "vitest";
import { FakeEmDash } from "../testing/fake-emdash.js";

describe("EmDash Code Block Pro Save Integration via FakeEmDash", () => {
	it("should successfully save content containing a code-block-pro block through runtime", async () => {
		const emdash = await FakeEmDash.createContext();

		await emdash.defineSchema({
			collections: [
				{
					slug: "posts",
					label: "Posts",
					supports: ["drafts", "revisions"],
					fields: [
						{ slug: "title", label: "Title", type: "string", required: true },
						{ slug: "content", label: "Content", type: "portableText" },
					],
				},
			],
		});

		const entryId = "test-post-id";
		await emdash.seed("posts", [
			{
				id: entryId,
				slug: "hello-world",
				status: "draft",
				locale: "en",
				title: "Hello World",
			},
		]);

		const updateBody = {
			status: "draft",
			data: {
				title: "Hello World",
				content: [
					{
						_type: "block",
						_key: "block1",
						style: "normal",
						children: [
							{
								_type: "span",
								_key: "span1",
								text: "Here is some code:",
							},
						],
					},
					{
						_type: "code-block-pro",
						_key: "codeblock1",
						code: "const x = 42;",
						language: "javascript",
						theme: "synthwave-84",
						filename: "index.js",
						lineNumbers: true,
						copyButton: true,
						lineHighlights: "1",
						maxHeight: "400px",
					},
				],
			},
		};

		const result = await emdash.save("posts", entryId, updateBody);

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.item.id).toBe(entryId);
			const draftRevisionId = result.data.item.draftRevisionId;
			expect(draftRevisionId).toBeDefined();

			const revisions = await emdash.getRevisions(entryId);
			const revisionRow = revisions.find((r: any) => r.id === draftRevisionId);
			expect(revisionRow).toBeDefined();

			const revisionData = JSON.parse(revisionRow.data);
			expect(revisionData.content).toHaveLength(2);
			expect(revisionData.content[1]._type).toBe("code-block-pro");
			expect(revisionData.content[1].code).toBe("const x = 42;");
		}

		await emdash.destroy();
	});

	it("should return SLUG_CONFLICT error with resolved slug on unique constraint collision", async () => {
		const emdash = await FakeEmDash.createContext();

		await emdash.defineSchema({
			collections: [
				{
					slug: "pages",
					label: "Pages",
					supports: [],
					fields: [
						{ slug: "title", label: "Title", type: "string", required: true },
					],
				},
			],
		});

		await emdash.seed("pages", [
			{
				id: "page-1",
				slug: "unique-slug-test",
				status: "draft",
				locale: "en",
				title: "Page 1",
			},
			{
				id: "page-2",
				slug: "another-slug",
				status: "draft",
				locale: "en",
				title: "Page 2",
			},
		]);

		const updateBody = {
			status: "draft",
			slug: "unique-slug-test",
			data: {
				title: "Page 2 Updated",
			},
		};

		const result = await emdash.save("pages", "page-2", updateBody);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBeDefined();
			expect(result.error?.code).toBe("SLUG_CONFLICT");
			expect(result.error?.message).toContain("Slug 'unique-slug-test' already exists");
		}

		await emdash.destroy();
	});
});
