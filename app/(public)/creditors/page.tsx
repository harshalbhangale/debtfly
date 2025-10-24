'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X } from 'lucide-react';
import { getAllCreditors, groupCreditorsByCategory, getCategoryName } from '@/lib/mock-data/creditors';
import { saveCreditorSelection, getCreditorSelection } from '@/lib/storage/public-onboarding';
import type { Creditor } from '@/lib/types/flow';
import { toast } from 'sonner';

export default function CreditorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreditorIds, setSelectedCreditorIds] = useState<string[]>([]);
  const [otherCreditors, setOtherCreditors] = useState<string[]>([]);
  const [otherInput, setOtherInput] = useState('');

  // Load saved selection
  useEffect(() => {
    const saved = getCreditorSelection();
    if (saved) {
      setSelectedCreditorIds(saved.selected_creditor_ids || []);
      setOtherCreditors(saved.other_creditors || []);
    }
  }, []);

  const allCreditors = getAllCreditors();
  const groupedCreditors = groupCreditorsByCategory();

  // Filter creditors based on search
  const filteredCreditors = searchQuery
    ? allCreditors.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCreditors;

  const handleCreditorToggle = (creditorId: string) => {
    setSelectedCreditorIds(prev =>
      prev.includes(creditorId)
        ? prev.filter(id => id !== creditorId)
        : [...prev, creditorId]
    );
  };

  const handleAddOther = () => {
    if (!otherInput.trim()) return;
    
    setOtherCreditors(prev => [...prev, otherInput.trim()]);
    setOtherInput('');
  };

  const handleRemoveOther = (index: number) => {
    setOtherCreditors(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const totalSelected = selectedCreditorIds.length + otherCreditors.length;
    
    if (totalSelected === 0) {
      toast.error('Please select at least one creditor');
      return;
    }

    // Save selection
    saveCreditorSelection({
      selected_creditor_ids: selectedCreditorIds,
      other_creditors: otherCreditors.length > 0 ? otherCreditors : undefined,
    });

    toast.success(`${totalSelected} creditor${totalSelected > 1 ? 's' : ''} selected`);
    router.push('/info');
  };

  const totalSelected = selectedCreditorIds.length + otherCreditors.length;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Which companies do you owe money to?
          </h1>
          <p className="text-lg text-muted-foreground">
            Select all the creditors you have debts with
          </p>
        </div>

        {/* Selected Count Badge */}
        {totalSelected > 0 && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              {totalSelected} creditor{totalSelected > 1 ? 's' : ''} selected
            </Badge>
          </div>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for your creditor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Creditor List */}
        {searchQuery ? (
          // Search Results
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCreditors.length > 0 ? (
                <div className="space-y-2">
                  {filteredCreditors.map(creditor => (
                    <CreditorCheckbox
                      key={creditor.id}
                      creditor={creditor}
                      isSelected={selectedCreditorIds.includes(creditor.id)}
                      onToggle={handleCreditorToggle}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No creditors found. Try adding it manually below.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          // Grouped by Category
          <div className="space-y-4">
            {Object.entries(groupedCreditors).map(([category, creditors]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {getCategoryName(category as Creditor['category'])}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {creditors.map(creditor => (
                      <CreditorCheckbox
                        key={creditor.id}
                        creditor={creditor}
                        isSelected={selectedCreditorIds.includes(creditor.id)}
                        onToggle={handleCreditorToggle}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Other/Not Listed */}
        <Card>
          <CardHeader>
            <CardTitle>Can&apos;t find your creditor?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter creditor name..."
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddOther();
                }}
              />
              <Button
                variant="outline"
                onClick={handleAddOther}
                disabled={!otherInput.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {otherCreditors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Added manually:</p>
                {otherCreditors.map((creditor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{creditor}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOther(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={totalSelected === 0}
            className="min-w-[200px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

// Creditor Checkbox Component
function CreditorCheckbox({
  creditor,
  isSelected,
  onToggle,
}: {
  creditor: Creditor;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <label
      htmlFor={`creditor-${creditor.id}`}
      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      <Checkbox
        id={`creditor-${creditor.id}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(creditor.id)}
      />
      <span className="flex-1 font-medium">{creditor.name}</span>
    </label>
  );
}

