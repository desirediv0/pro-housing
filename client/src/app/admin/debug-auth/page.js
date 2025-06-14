"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthDebugPage() {
  const [authInfo, setAuthInfo] = useState({});
  const [apiResponse, setApiResponse] = useState(null);

  const getAllCookies = () => {
    const cookies = {};
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[name] = value;
      }
    });
    return cookies;
  };

  const getAuthToken = () => {
    const localStorageToken = localStorage.getItem("adminToken");
    const cookies = getAllCookies();

    return {
      localStorage: {
        adminToken: localStorageToken || "Not found",
      },
      cookies: {
        accessToken: cookies.accessToken || "Not found",
        adminToken: cookies.adminToken || "Not found",
        refreshToken: cookies.refreshToken || "Not found",
      },
      selectedToken:
        localStorageToken ||
        cookies.accessToken ||
        cookies.adminToken ||
        cookies.refreshToken ||
        "No token found",
    };
  };

  const testAPI = async () => {
    try {
      const tokenInfo = getAuthToken();
      const token = tokenInfo.selectedToken;

      if (token === "No token found") {
        setApiResponse({ error: "No token available for testing" });
        return;
      }

      console.log("Testing with token:", token.substring(0, 20) + "...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sidebar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      setApiResponse({
        status: response.status,
        statusText: response.statusText,
        data: result,
        headers: Object.fromEntries(response.headers.entries()),
      });
    } catch (error) {
      setApiResponse({
        error: error.message,
        stack: error.stack,
      });
    }
  };

  useEffect(() => {
    setAuthInfo(getAuthToken());
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">
        🔍 Authentication Debug
      </h1>

      {/* Token Information */}
      <Card>
        <CardHeader>
          <CardTitle>🔑 Token Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">localStorage</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(authInfo.localStorage, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Cookies</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(authInfo.cookies, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Selected Token</h3>
              <p className="bg-blue-100 p-3 rounded text-sm break-all">
                {authInfo.selectedToken === "No token found" ? (
                  <span className="text-red-600">
                    ❌ {authInfo.selectedToken}
                  </span>
                ) : (
                  <span className="text-green-600">
                    ✅ {authInfo.selectedToken?.substring(0, 50)}...
                  </span>
                )}
              </p>
            </div>
          </div>

          <Button onClick={() => setAuthInfo(getAuthToken())} className="mt-4">
            🔄 Refresh Token Info
          </Button>
        </CardContent>
      </Card>

      {/* API Test */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={testAPI}
            className="mb-4 bg-blue-600 hover:bg-blue-700"
          >
            🚀 Test Sidebar API
          </Button>

          {apiResponse && (
            <div>
              <h3 className="font-semibold text-lg mb-2">API Response:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto max-h-96">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>🍪 Raw Cookie Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {document.cookie || "No cookies found"}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
