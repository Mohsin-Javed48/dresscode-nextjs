"use client";

import { useState, useEffect } from "react";
import {
  Order,
  OrdersResponse,
  fetchUserOrders,
  searchOrders,
  getOrCreateGuestId,
} from "@/app/_lib/ordersClient";
import OrderCard from "@/app/_components/OrderCard";
import OrderFilters from "@/app/_components/OrderFilters";
import OrderPagination from "@/app/_components/OrderPagination";
import { Package, AlertCircle, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const loadOrders = async (page = 1, status?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = getOrCreateGuestId();
      const response: OrdersResponse = await fetchUserOrders(userId, {
        page,
        limit: 10,
        status: status || undefined,
      });

      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSearchQuery(query);

      if (query.trim()) {
        const response: OrdersResponse = await searchOrders(query, {
          page: 1,
          limit: 10,
          status: filters.status || undefined,
        });
        setOrders(response.orders);
        setPagination(response.pagination);
      } else {
        loadOrders(1, filters.status);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    loadOrders(1, newFilters.status);
  };

  const handlePageChange = (page: number) => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      loadOrders(page, filters.status);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="text-gray-600">Loading your orders...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <OrderFilters
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || filters.status
                ? "Try adjusting your search or filter criteria."
                : "You haven't placed any orders yet."}
            </p>
            {!searchQuery && !filters.status && (
              <div className="mt-6">
                <a
                  href="/shop"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Shopping
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={(orderId) => {
                  window.location.href = `/orders/${orderId}`;
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="mt-8">
            <OrderPagination
              current={pagination.current}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
