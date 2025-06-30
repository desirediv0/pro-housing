import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Property Not Found | Pro Housing",
  description:
    "The property you're looking for doesn't exist or has been removed. Browse our other available properties.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="glass backdrop-blur-xl rounded-2xl p-8 shadow-premium-lg border border-white/20">
          <Building2 className="h-20 w-20 text-[#5E4CBB] mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, the property you&apos;re looking for doesn&apos;t exist or
            has been removed. It might have been sold, rented, or withdrawn from
            the market. 
          </p>

          <div className="space-y-4">
            <Link href="/properties">
              <Button className="w-full bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Home className="h-5 w-5 mr-2" />
                Browse All Properties
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-[#5E4CBB] text-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white px-6 py-3 rounded-xl transition-all"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact our support team for
              assistance finding the right property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
