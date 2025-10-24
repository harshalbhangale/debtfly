'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Step5IDVerificationPage() {
  const router = useRouter();
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleIDUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
      toast.success('ID document selected');
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfAddress(e.target.files[0]);
      toast.success('Proof of address selected');
    }
  };

  const handleContinue = async () => {
    if (!idDocument) {
      toast.error('Please upload your ID document');
      return;
    }

    if (!proofOfAddress) {
      toast.error('Please upload proof of address');
      return;
    }

    // Simulate upload
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save verification data
    const verificationData = {
      id_document_type: 'passport', // In production, detect from file
      id_document_name: idDocument.name,
      proof_document_name: proofOfAddress.name,
      uploaded_at: new Date().toISOString(),
      aml_check_status: 'pending',
    };

    localStorage.setItem('debtfly_id_verification', JSON.stringify(verificationData));
    
    setUploading(false);
    toast.success('Documents uploaded successfully');
    router.push('/plan/step-6-complete');
  };

  const handleBack = () => {
    router.push('/plan/step-4-payment');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Plan Selection: Step 5 of 6</span>
            <span>83% complete</span>
          </div>
          <Progress value={83} className="h-2" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2"
          disabled={uploading}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Identity Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            We need to verify your identity before starting your case
          </p>
          <Badge variant="secondary" className="text-xs">
            Document: IDV-001
          </Badge>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Why we need this</p>
                <p className="text-sm text-muted-foreground">
                  We&apos;re required by law (AML regulations) to verify your identity before providing our services.
                  Your documents are encrypted and stored securely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ID Document Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Photo ID Document</CardTitle>
                <CardDescription>Upload one of the following</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="font-medium mb-1">Passport</p>
                <p className="text-xs text-muted-foreground">Photo page</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="font-medium mb-1">Driving Licence</p>
                <p className="text-xs text-muted-foreground">UK photocard</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="font-medium mb-1">National ID</p>
                <p className="text-xs text-muted-foreground">EU/EEA cards</p>
              </div>
            </div>

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              idDocument ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}>
              {idDocument ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">{idDocument.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(idDocument.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIdDocument(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" asChild>
                    <label htmlFor="id_upload" className="cursor-pointer">
                      Select File
                    </label>
                  </Button>
                  <input
                    id="id_upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleIDUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, PDF (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Proof of Address Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>Proof of Address</CardTitle>
                <CardDescription>Dated within the last 3 months</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              {['Utility Bill', 'Bank Statement', 'Council Tax', 'Gov Letter'].map((type) => (
                <div key={type} className="p-3 border rounded-lg text-center">
                  <p className="text-xs font-medium">{type}</p>
                </div>
              ))}
            </div>

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              proofOfAddress ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
            }`}>
              {proofOfAddress ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">{proofOfAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(proofOfAddress.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProofOfAddress(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" asChild>
                    <label htmlFor="proof_upload" className="cursor-pointer">
                      Select File
                    </label>
                  </Button>
                  <input
                    id="proof_upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleProofUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPG, PNG, PDF (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold mb-1">Your data is secure</p>
                <p className="text-sm text-muted-foreground">
                  All documents are encrypted in transit and at rest. Only authorized staff can access your documents,
                  and we comply with GDPR and data protection regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!idDocument || !proofOfAddress || uploading}
            className="gap-2 min-w-[200px]"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

