"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { className?: string; children?: React.ReactNode };

export class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // log to console and leave room to integrate Sentry/analytics
    console.error("ErrorBoundary caught error:", error, info);
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  renderFallback() {
    const { className } = this.props;
    const errMessage = this.state.error?.message ?? "An unexpected error occurred.";

    return (
      <div className={cn("container mx-auto p-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{errMessage}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.location.reload()}>Reload page</Button>
              <Button variant="outline" onClick={() => window.history.back()}>Go back</Button>
              <Button variant="ghost" onClick={this.reset}>Try again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
