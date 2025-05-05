"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NewTransactionModal({ onTransactionComplete, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.recipient) {
      newErrors.recipient = "Please enter a recipient department";
    }
    if (!formData.amount) {
      newErrors.amount = "Please enter an amount";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    if (!formData.description) {
      newErrors.description = "Please enter a transaction description";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    console.log("Submitting transaction:", formData);

    if (onSubmit) {
      try {
        console.log(formData.recipient,formData.amount);
        const transaction = await onSubmit(formData.recipient,formData.amount);
        console.log("transaction",transaction);
        if (onTransactionComplete) {
          onTransactionComplete(); // Refresh the dashboard after transaction
        }
        setFormData({ recipient: "", amount: "", description: "" });
        setStep(1);
        setOpen(false);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setStep(1);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>New Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Send funds to another department on the blockchain network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient Department</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient department"
                  value={formData.recipient}
                  onChange={(e) => handleChange("recipient", e.target.value)}
                  className={errors.recipient ? "border-red-500" : ""}
                />
                {errors.recipient && (
                  <p className="text-sm text-red-500">{errors.recipient}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={errors.amount ? "border-red-500" : ""}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Purpose of transaction"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleNext}>
                Review Transaction
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogDescription>
                Please review the transaction details before submitting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Blockchain transactions cannot be reversed once confirmed.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="button" onClick={handleSubmit} className="gap-2">
                Submit Transaction <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
