"use client";

import { useState } from "react";
import { account, databases, DATABASE_ID, COLLECTION_ID } from "@/lib/appwrite";

export default function TestAppwrite() {
  const [status, setStatus] = useState<string>("Not tested");
  const [details, setDetails] = useState<any>(null);

  const testConnection = async () => {
    try {
      setStatus("Testing connection...");
      
      // Test 1: Check if we can reach Appwrite
      const health = await fetch("https://cloud.appwrite.io/v1/health");
      if (!health.ok) {
        throw new Error("Cannot reach Appwrite server");
      }
      
      setStatus("✅ Appwrite server is reachable");
      
      // Test 2: Try to get current session (should fail if not logged in)
      try {
        const user = await account.get();
        setDetails({ type: "Already logged in", user });
        setStatus("✅ Already logged in as: " + user.email);
      } catch (err: any) {
        setStatus("✅ Not logged in (expected)");
      }
      
      // Test 3: Try to list databases (to check project access)
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, []);
        setDetails({ type: "Database access", count: response.total });
        setStatus("✅ Can access database. Total properties: " + response.total);
      } catch (err: any) {
        setStatus("⚠️ Cannot access database: " + err.message);
        setDetails({ error: err.message, code: err.code });
      }
      
    } catch (error: any) {
      setStatus("❌ Error: " + error.message);
      setDetails({ error: error.message });
    }
  };

  const testLogin = async () => {
    try {
      setStatus("Testing login...");
      
      // Try to login with documented credentials
      await account.createEmailPasswordSession(
        "perealtorsit@gmail.com",
        "Hical@1767"
      );
      
      const user = await account.get();
      setStatus("✅ Login successful!");
      setDetails({ user });
      
    } catch (error: any) {
      setStatus("❌ Login failed: " + error.message);
      setDetails({ 
        error: error.message, 
        code: error.code,
        type: error.type 
      });
    }
  };

  const checkSession = async () => {
    try {
      const user = await account.get();
      setStatus("✅ Current user: " + user.email);
      setDetails({ user });
    } catch (error: any) {
      setStatus("❌ No active session");
      setDetails({ error: error.message });
    }
  };

  const listSessions = async () => {
    try {
      const sessions = await account.listSessions();
      setStatus("✅ Active sessions: " + sessions.total);
      setDetails({ sessions });
    } catch (error: any) {
      setStatus("❌ Cannot list sessions: " + error.message);
      setDetails({ error: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Appwrite Connection Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Test Connection
          </button>
          
          <button
            onClick={testLogin}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium ml-4"
          >
            Test Login
          </button>
          
          <button
            onClick={checkSession}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium ml-4"
          >
            Check Session
          </button>
          
          <button
            onClick={listSessions}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium ml-4"
          >
            List Sessions
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg mb-4">{status}</p>
          
          {details && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Endpoint:</strong> https://cloud.appwrite.io/v1</p>
            <p><strong>Project ID:</strong> perealtors</p>
            <p><strong>Database ID:</strong> {DATABASE_ID}</p>
            <p><strong>Collection ID:</strong> {COLLECTION_ID}</p>
            <p><strong>Test Email:</strong> perealtorsit@gmail.com</p>
            <p><strong>Test Password:</strong> Hical@1767</p>
          </div>
        </div>

        <div className="mt-8 bg-yellow-900/20 border border-yellow-600 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Troubleshooting</h2>
          <ul className="space-y-2 text-sm">
            <li>1. Check if the user exists in Appwrite Console → Auth → Users</li>
            <li>2. Verify the email and password are correct</li>
            <li>3. Check if localhost is whitelisted in Appwrite Console → Settings → Platforms</li>
            <li>4. Make sure the project ID is correct: "perealtors"</li>
            <li>5. Check browser console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
