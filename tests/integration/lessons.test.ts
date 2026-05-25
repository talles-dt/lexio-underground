// tests/integration/lessons.test.ts
// Local mock test for /api/lessons/generate

test('POST /api/lessons/generate returns 201 with mock lesson', async () => {
 const response = await fetch('http://localhost:3000/api/lessons/generate', {
 method: 'POST',
 body: JSON.stringify({
 pillar: 'grammar',
 difficulty: 'B2',
 interest: 'cachorro',
 }),
 });
 
 const data = await response.json();
 expect(response.status).toBe(201);
 expect(data.content.grammar).toMatch(/Mock grammar/);
});