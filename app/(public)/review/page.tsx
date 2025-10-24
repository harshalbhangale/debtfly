'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, FileText, Shield, Eye, CheckCircle2 } from 'lucide-react';
import { 
  getDebtDetails,
  getTotalDebtAmount,
  getCreditorCount,
  acknowledgeDocument,
  allDocumentsAcknowledged,
  getDocumentAcknowledgements
} from '@/lib/storage/public-onboarding';
import type { DebtDetails } from '@/lib/types/flow';
import { toast } from 'sonner';

const TRANSPARENCY_DOCUMENTS = [
  {
    code: 'PRIV-001' as const,
    name: 'Privacy Notice',
    description: 'How we collect, use, and protect your personal data',
    icon: Shield,
  },
  {
    code: 'SCOPE-001' as const,
    name: 'Scope of Services',
    description: 'What we do and don&apos;t provide',
    icon: FileText,
  },
  {
    code: 'STAT-001' as const,
    name: 'Regulatory Status',
    description: 'Our regulatory position and authority',
    icon: CheckCircle2,
  },
];

export default function ReviewPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<DebtDetails[]>([]);
  const [acknowledgedDocs, setAcknowledgedDocs] = useState<Set<string>>(new Set());
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const debtList = getDebtDetails();
    if (debtList.length === 0) {
      router.push('/debt-details');
      return;
    }

    setDebts(debtList);

    // Load acknowledged documents
    const existingAcks = getDocumentAcknowledgements();
    const ackedSet = new Set(
      existingAcks.filter(doc => doc.acknowledged).map(doc => doc.document_code)
    );
    setAcknowledgedDocs(ackedSet);
  }, [router]);

  useEffect(() => {
    // Check if all documents are acknowledged
    setCanContinue(allDocumentsAcknowledged());
  }, [acknowledgedDocs]);

  const handleDocumentAcknowledge = (docCode: typeof TRANSPARENCY_DOCUMENTS[number]['code']) => {
    acknowledgeDocument(docCode);
    setAcknowledgedDocs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(docCode)) {
        newSet.delete(docCode);
      } else {
        newSet.add(docCode);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (!canContinue) {
      toast.error('Please acknowledge all documents to continue');
      return;
    }

    toast.success('All information confirmed');
    router.push('/complete');
  };

  const handleBack = () => {
    router.push('/debt-details');
  };

  const handleEditDebts = () => {
    router.push('/debt-details');
  };

  const totalDebt = getTotalDebtAmount();
  const creditorCount = getCreditorCount();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step 7 of 8</span>
            <span>88% complete</span>
          </div>
          <Progress value={88} className="h-2" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Review Your Information
          </h1>
          <p className="text-lg text-muted-foreground">
            Please check everything is correct before continuing
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Creditors</p>
                <p className="text-3xl font-bold text-primary">{creditorCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Debts</p>
                <p className="text-3xl font-bold text-primary">{debts.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">
                  £{totalDebt.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debts List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Debts</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditDebts}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {debts.map((debt, index) => (
              <div key={debt.id}>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{debt.creditor_name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">
                        £{debt.approximate_amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </Badge>
                      <Badge variant="outline">
                        {debt.debt_status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {debt.account_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    {debt.account_number && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Ref: {debt.account_number}
                      </p>
                    )}
                  </div>
                </div>
                {index < debts.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Document Acknowledgements */}
        <Card>
          <CardHeader>
            <CardTitle>Important Documents</CardTitle>
            <CardDescription>
              Please read and acknowledge these documents before continuing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TRANSPARENCY_DOCUMENTS.map((doc) => {
              const Icon = doc.icon;
              const isAcknowledged = acknowledgedDocs.has(doc.code);
              
              return (
                <div
                  key={doc.code}
                  className={`p-4 border rounded-lg transition-all ${
                    isAcknowledged ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-semibold">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 flex-shrink-0"
                          onClick={() => {
                            // In production, open document modal or PDF
                            toast.info('Document viewing coming soon');
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Checkbox
                          id={doc.code}
                          checked={isAcknowledged}
                          onCheckedChange={() => handleDocumentAcknowledge(doc.code)}
                        />
                        <Label
                          htmlFor={doc.code}
                          className="cursor-pointer text-sm"
                        >
                          I have read and understood this document
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue}
            className="min-w-[200px]"
          >
            {canContinue ? 'Continue to Portal' : 'Acknowledge all documents'}
          </Button>
        </div>

        {!canContinue && (
          <p className="text-center text-sm text-muted-foreground">
            Please acknowledge all 3 documents to continue
          </p>
        )}
      </div>
    </div>
  );
}

