import { mockDocuments } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = mockDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(mockDocuments.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Public Documents</h1>
        <p className="text-muted-foreground">
          Access municipal policies, tenders, and official documents.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="secondary" className="cursor-pointer">
            {category}
          </Badge>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Documents List */}
      <div className="grid gap-4">
        {filteredDocs.map((doc, index) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elegant transition-all animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium">{doc.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <Badge variant="outline" className="text-xs">
                    {doc.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {doc.downloads} downloads
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
