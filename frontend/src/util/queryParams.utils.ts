export const getQueryParams = () => new URLSearchParams(window.location.search);

export const updateQueryParams = (
  params: Record<string, string | number | null>,
) => {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === "" || value === 0) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  window.history.replaceState({}, "", url);
};
