import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const redirectTimerRef = useRef(null);
  
  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearInterval(redirectTimerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    async function capturePayment() {
      try {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("paymentId");
        const payerId = params.get("PayerID");
        const orderId = JSON.parse(localStorage.getItem("currentOrderId"));

        if (!paymentId || !payerId || !orderId) {
          setError("Missing payment information");
          setIsProcessing(false);
          return;
        }

        const response = await captureAndFinalizePaymentService(
          paymentId,
          payerId,
          orderId
        );

        if (response?.success) {
          localStorage.removeItem("currentOrderId");
          setPaymentDetails(response.data);
          setShowSuccessDialog(true);
          setIsProcessing(false);
          
          // Show toast notification
          toast({
            title: "Payment Successful!",
            description: "Your course purchase was completed successfully.",
            variant: "success",
          });
          
          // Start countdown for automatic redirect
          redirectTimerRef.current = setInterval(() => {
            setRedirectCountdown(prev => {
              if (prev <= 1) {
                clearInterval(redirectTimerRef.current);
                navigate("/student-courses");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(response?.message || "Payment processing failed");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Payment capture error:", error);
        setError("Payment processing failed. Please try again.");
        setIsProcessing(false);
      }
    }

    capturePayment();
  }, [location.search, navigate, toast]);
  
  function handleGoToMyCourses() {
    // Clear the timer if user manually navigates
    if (redirectTimerRef.current) {
      clearInterval(redirectTimerRef.current);
    }
    navigate("/student-courses");
  }

  return (
    <>
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>{error ? "Payment Failed" : "Processing Payment"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Please wait while we process your payment...</p>
            </div>
          ) : error ? (
            <div className="text-red-500">
              <p>{error}</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/courses")}
              >
                Return to Courses
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Your payment has been successfully processed.
            </DialogDescription>
          </DialogHeader>
          
          {paymentDetails && (
            <div className="bg-gray-50 p-4 rounded-md my-4">
              <p className="font-medium">Purchase Details:</p>
              <p className="mt-2">Course: {paymentDetails.courseTitle}</p>
              <p>Amount: ${paymentDetails.coursePricing}</p>
              <p>Instructor: {paymentDetails.instructorName}</p>
            </div>
          )}
          
          <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-700">
            <p>You will be redirected to My Courses page in <span className="font-bold">{redirectCountdown}</span> {redirectCountdown === 1 ? 'second' : 'seconds'}.</p>
          </div>
          
          <DialogFooter className="mt-4">
            <Button onClick={handleGoToMyCourses} className="w-full">
              Go to My Courses Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PaypalPaymentReturnPage;
