async function test() {
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode: '123456' })
  });
  console.log(res.status);
  const data = await res.json();
  console.log(data);
}
test();
