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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Dummy data for department
const departmentInfo = {
  id: "DEPT-EDU-001",
  name: "Education Department",
  balance: 125000,
  transactionsCount: 42,
  registrationDate: "2024-12-15", // More than 30 days ago
  isValidator: false,
  validatorVotes: 3,
  validatorRequirement: 5,
};

export function ValidatorApplicationModal({onSubmit}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [agreements, setAgreements] = useState({
    responsibilities: false,
    availability: false,
    security: false,
    terms: false,
  });

  const meetsBalanceRequirement = departmentInfo.balance >= 100000;
  const meetsTransactionRequirement = departmentInfo.transactionsCount >= 5;
  const meetsAgeRequirement = true; // Assuming the registration date check is done

  const allRequirementsMet =
    meetsBalanceRequirement &&
    meetsTransactionRequirement &&
    meetsAgeRequirement;
  const allAgreementsChecked = Object.values(agreements).every(
    (value) => value === true
  );

  const handleAgreementChange = (field) => {
    setAgreements((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    
    await onSubmit();
    console.log("Validator application submitted");

    // Reset and close
    setAgreements({
      responsibilities: false,
      availability: false,
      security: false,
      terms: false,
    });
    setStep(1);
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setStep(1);
      setAgreements({
        responsibilities: false,
        availability: false,
        security: false,
        terms: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!allRequirementsMet}>Apply as Validator</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Validator Application
              </DialogTitle>
              <DialogDescription>
                Apply to become a validator on the GovChain blockchain network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <h4 className="font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  What is a Validator?
                </h4>
                <p className="mt-2 text-sm">
                  Validators play a crucial role in verifying transactions and
                  maintaining the integrity of the blockchain network. As a
                  validator, your department will help secure the network and
                  ensure all transactions are legitimate.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1 ${
                        meetsBalanceRequirement
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {meetsBalanceRequirement ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm">Minimum balance of ₹100,000</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      Current: ₹{departmentInfo.balance.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1 ${
                        meetsTransactionRequirement
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {meetsTransactionRequirement ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm">
                      At least 5 completed transactions
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      Current: {departmentInfo.transactionsCount}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="rounded-full p-1 bg-green-100 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm">
                      Department must be registered for at least 30 days
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      ✓ Eligible
                    </span>
                  </li>
                </ul>
              </div>

              {!allRequirementsMet && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Requirements Not Met</AlertTitle>
                  <AlertDescription>
                    Your department does not meet all the requirements to become
                    a validator.
                  </AlertDescription>
                </Alert>
              )}

              {allRequirementsMet && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Requirements Met</AlertTitle>
                  <AlertDescription>
                    Your department meets all the requirements to become a
                    validator.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleNext}
                disabled={!allRequirementsMet}
              >
                Continue Application
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Validator Agreements
              </DialogTitle>
              <DialogDescription>
                Please review and agree to the validator responsibilities.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="responsibilities"
                    checked={agreements.responsibilities}
                    onCheckedChange={() =>
                      handleAgreementChange("responsibilities")
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="responsibilities"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Validator Responsibilities
                    </Label>
                    <p className="text-sm text-gray-500">
                      I understand that as a validator, my department is
                      responsible for verifying transactions and maintaining
                      network integrity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="availability"
                    checked={agreements.availability}
                    onCheckedChange={() =>
                      handleAgreementChange("availability")
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="availability"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      System Availability
                    </Label>
                    <p className="text-sm text-gray-500">
                      I confirm that my department will maintain the necessary
                      infrastructure to ensure validator node availability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="security"
                    checked={agreements.security}
                    onCheckedChange={() => handleAgreementChange("security")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="security"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Security Measures
                    </Label>
                    <p className="text-sm text-gray-500">
                      I agree to implement all required security measures to
                      protect the validator node and private keys.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={() => handleAgreementChange("terms")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Terms and Conditions
                    </Label>
                    <p className="text-sm text-gray-500">
                      I have read and agree to the GovChain Validator Terms and
                      Conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Application Progress</span>
                  <span>
                    {Object.values(agreements).filter(Boolean).length} of 4
                    agreements
                  </span>
                </div>
                <Progress
                  value={
                    (Object.values(agreements).filter(Boolean).length / 4) * 100
                  }
                  className="h-2"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!allAgreementsChecked}
                className="gap-2"
              >
                Submit Application <Shield className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
