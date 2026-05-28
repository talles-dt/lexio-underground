// app/api/lessons/generate/logic.ts
// Mocked for build safety

const generateLesson = async (stage: string) => ({
  id: "mocked-lesson-id",
  mnemonic: `**${stage}**→Mocked→Lesson→Example**→**`,
  archetypes: ["architect", "grammarian"],
  motto: "Fake lesson for build verification",
});

export { generateLesson };
