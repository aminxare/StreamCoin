"use client";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setSearch,
    setSortBy,
    setSortDirection,
    toggleSortDirection,
} from "@/store/marketSlice";
import { coinService } from "@/services/coinService";
import type { Coin } from "@/type";
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

const pageSize = 10;

type SortableCoinKey =
    | "current_price"
    | "price_change_percentage_24h"
    | "market_cap"
    | "total_volume";

export function useCryptoMarketOverview() {
    const dispatch = useAppDispatch();
    const { search, sortBy, sortDirection } = useAppSelector(
        (state) => state.market,
    );
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        error,
        isLoading,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery<Coin[], Error, InfiniteData<Coin[]>, ["coins"], number>({
        queryKey: ["coins"],
        queryFn: ({ pageParam = 1 }) =>
            coinService.getMarketCoins(pageParam, pageSize),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) =>
            lastPage.length === pageSize ? pages.length + 1 : undefined,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        refetchInterval: 60_000,
    });

    useEffect(() => {
        if (!data) return;
        setLastUpdated(new Date());
    }, [data]);

    const coins = useMemo(() => data ? (data as InfiniteData<Coin[]>).pages.flat() : [], [data]);

    useEffect(() => {
        if (!observerTarget.current || !hasNextPage || isFetchingNextPage || isLoading) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

    const filteredCoins = useMemo(() => {
        const normalizedQuery = search.trim().toLowerCase();
        const visibleCoins = normalizedQuery
            ? coins.filter(
                (coin) =>
                    coin.name.toLowerCase().includes(normalizedQuery) ||
                    coin.symbol.toLowerCase().includes(normalizedQuery),
            )
            : coins;

        return [...visibleCoins].sort((a, b) => {
            const aValue = a[sortBy] ?? 0;
            const bValue = b[sortBy] ?? 0;

            return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        });
    }, [coins, search, sortBy, sortDirection]);

    const handleSearchChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(setSearch(event.target.value));
        },
        [dispatch],
    );

    const handleSort = useCallback(
        (key: SortableCoinKey | null) => {
            if (!key) {
                return;
            }

            if (sortBy === key) {
                dispatch(toggleSortDirection());
            } else {
                dispatch(setSortBy(key));
                dispatch(setSortDirection("desc"));
            }
        },
        [dispatch, sortBy],
    );

    const handleRefresh = useCallback(() => {
        void refetch();
    }, [refetch]);

    return {
        error,
        isLoading,
        isFetching,
        isFetchingNextPage,
        lastUpdated,
        search,
        filteredCoins,
        sortBy,
        sortDirection,
        hasMore: Boolean(hasNextPage),
        observerTarget,
        handleSearchChange,
        handleSort,
        handleRefresh,
    };
}
