"use client";

import React, { useState } from "react";
import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BackNav } from "@/components/back-nav";
import { deleteAccount, exportUserData } from "@/app/actions/account";

export default function AccountPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const data = await exportUserData();

      // Create and download JSON file
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      element.href = URL.createObjectURL(file);
      element.download = `mood-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export data";
      setExportError(errorMessage);
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      // Redirect happens in the server action
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete account";
      setDeleteError(errorMessage);
      console.error("Delete error:", error);
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="flex flex-col p-4 h-full">
      <div className="space-y-6 max-w-2xl mx-auto w-full">
        <BackNav href="/protected" />

        <div>
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and export your data
          </p>
        </div>

        {/* Export Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download a JSON file containing all your entries and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exportError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {exportError}
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              This will include:
            </p>
            <ul className="text-sm text-muted-foreground mb-6 ml-4 space-y-1">
              <li>• All your entries</li>
              <li>• System metrics</li>
              <li>• Metrics you created</li>
            </ul>
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export Data as JSON"}
            </Button>
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-600">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deleteError && (
              <div className="mb-4 p-3 bg-red-200 text-red-800 rounded-md text-sm">
                {deleteError}
              </div>
            )}
            <p className="text-sm text-red-700 mb-6">
              Deleting your account will permanently remove all your data,
              including entries, custom metrics, and tracking information. This
              action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated
                    data including:
                    <ul className="mt-3 ml-4 space-y-1">
                      <li>• All your entries</li>
                      <li>• All custom metrics you created</li>
                      <li>• All tracking information</li>
                    </ul>
                    <p className="mt-3">This action cannot be undone.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeletingAccount ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
