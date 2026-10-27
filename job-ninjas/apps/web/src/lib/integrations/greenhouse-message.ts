export function greenhouseAuthMessage(status: number, action: string): string {
  if (status === 401 || status === 403) {
    return `Greenhouse refused this key while trying to ${action}. Use a Harvest API key that can read jobs and candidates, or type demo to import sample people.`;
  }
  if (status === 404) {
    return `Greenhouse could not find that ${action}. Check the key and the job, or type demo.`;
  }
  return `Greenhouse did not respond (${status}) while trying to ${action}. Try again, or type demo to use sample jobs.`;
}
