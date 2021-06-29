export async function create(items) {
  const response = await fetch("/api/preferences", {
    method: "POST",
    body: JSON.stringify({ items, base_url: window.location.origin }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.body;
}
