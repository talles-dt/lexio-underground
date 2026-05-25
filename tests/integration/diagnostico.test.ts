// tests/integration/diagnostico.test.ts
// Mock test for diagnostic API

test('POST /api/diagnostico returns mock share token', async () => {
 const response = await fetch('http://localhost:3000/api/diagnostico', {
 method: 'POST',
 body: JSON.stringify({
 email: 'test@example.com',
 answers: { grammar_1: 5, logic_1: 3, communication_1: 2 },
 }),
 });
 
 const data = await response.json();
 expect(data.share_token).toMatch(/^mock-token-/);
});