const fs = require("fs");
let content = fs.readFileSync("app/diagnostico/page.tsx", "utf-8");
content = content.replace(
  /return renderQuestionContent\(\);/g,
  (match, offset) => {
    return (
      "return () => {" +
      "const { step, result, currentQuestion, totalAnswered, estimatedTotal, textAnswer, showWhy, selectedAnswer, user } = this;" +
      "return renderQuestionContent();" +
      "}.call({" +
      "step: step," +
      "result: result," +
      "currentQuestion: currentQuestion," +
      "totalAnswered: totalAnswered," +
      "estimatedTotal: estimatedTotal," +
      "textAnswer: textAnswer," +
      "showWhy: showWhy," +
      "selectedAnswer: selectedAnswer," +
      "user: user" +
      "});"
    );
  },
);
fs.writeFileSync("app/diagnostico/page.tsx", content);
console.log("✓ Wrapped JSX in variable-binding closure");
