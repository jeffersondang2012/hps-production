import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const [page, setPage] = useState(options.initialPage || 1);
  const [limit, setLimit] = useState(options.initialLimit || 10);
  const [total, setTotal] = useState(0);

  const nextPage = useCallback(() => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  }, [page, limit, total]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  }, [total, limit]);

  return {
    page,
    limit,
    total,
    setTotal,
    nextPage,
    prevPage,
    goToPage,
    setLimit
  };
}; 