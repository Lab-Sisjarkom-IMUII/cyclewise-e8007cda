import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            Cycle Tracker
          </h1>
          <nav className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-pink-600 hover:bg-pink-700">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Track Your Menstrual Cycle with AI Insights
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Understand your body better with our comprehensive cycle tracking app. Get AI-powered predictions, log symptoms, and gain valuable health insights.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900 dark:to-purple-900 rounded-2xl h-96 flex items-center justify-center">
            <svg className="w-48 h-48 opacity-50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="20" r="6" fill="currentColor" />
              <circle cx="70" cy="35" r="6" fill="currentColor" />
              <circle cx="70" cy="65" r="6" fill="currentColor" />
              <circle cx="50" cy="80" r="6" fill="currentColor" />
              <circle cx="30" cy="65" r="6" fill="currentColor" />
              <circle cx="30" cy="35" r="6" fill="currentColor" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-900 py-16 md:py-24 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-pink-50 dark:bg-slate-800 border-pink-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-pink-600 dark:text-pink-400">
                  Track Your Cycle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Log your menstrual periods with start and end dates. Visualize your data with an interactive calendar.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-slate-800 border-purple-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400">
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get intelligent predictions for your next cycle, ovulation date, and cycle patterns based on your data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  Log Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Record any symptoms you experience and track patterns to better understand your body.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account with basic health info" },
              { step: "2", title: "Log Cycle", desc: "Record your menstrual period dates" },
              { step: "3", title: "Add Symptoms", desc: "Track any symptoms throughout your cycle" },
              { step: "4", title: "Get Insights", desc: "Receive AI-powered predictions & analysis" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users tracking their health with Cycle Tracker
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" variant="outline" className="text-pink-600 border-white hover:bg-white/10">
              Start Your Free Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>Cycle Tracker © 2025. Your health, your data, your control.</p>
        </div>
      </footer>
    </div>
  );
}
