// Auto-stub for '@/lexio-mind/orchestrator'
export const generateLesson = () => Promise.resolve({ content: "Mock lesson" });

export const generateConversationShadow = () =>
  Promise.resolve({ feedback: "Mock feedback" });

const orchestrator = {
  generateLesson,
  generateConversationShadow,
};

export default orchestrator;
