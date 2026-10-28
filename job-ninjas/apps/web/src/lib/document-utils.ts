/**
 * Document & PDF utilities for JobNinjas board and presentation viewer.
 */

/**
 * Clean up ugly hash filenames (e.g. Google Drive / ATS auto-generated names like ACFrOgArYoXPPqhQ4v...)
 * to keep UI cards neat and readable.
 */
export function cleanDocTitle(fileName?: string, fallback = 'Document'): string {
  if (!fileName) return fallback;
  const trimmed = fileName.trim();
  if (trimmed.length > 36 && !trimmed.includes(' ') && (trimmed.startsWith('ACFr') || /^[A-Za-z0-9_-]{36,}/.test(trimmed))) {
    const extMatch = trimmed.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1] : 'pdf';
    return `Resume / Document.${ext}`;
  }
  return trimmed;
}

/**
 * Returns a PDF URL with Chromium / PDF.js viewer parameters to eliminate side numbers (thumbnail navpanes)
 * and provide clean viewport fitting.
 *
 * Parameters used:
 * - navpanes=0: Hides the thumbnail / page-number side navigation pane (solves "no need of side numbers")
 * - toolbar=0: Hides embedded double toolbars on small canvas cards
 * - view=FitH: Fits the PDF page horizontally
 */
export function getPdfViewerSrc(
  fileSrc?: string,
  options: { hideNavPanes?: boolean; hideToolbar?: boolean; fit?: string } = {}
): string {
  if (!fileSrc) return '';
  const { hideNavPanes = true, hideToolbar = false, fit = 'FitH' } = options;

  const isPdf = fileSrc.startsWith('data:application/pdf') || fileSrc.toLowerCase().includes('.pdf');
  if (!isPdf) return fileSrc;

  const [baseUrl] = fileSrc.split('#');
  const params: string[] = [];
  if (hideNavPanes) params.push('navpanes=0');
  if (hideToolbar) params.push('toolbar=0');
  if (fit) params.push(`view=${fit}`);

  return `${baseUrl}#${params.join('&')}`;
}
