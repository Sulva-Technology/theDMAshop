import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore, CMSContent } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Save, CheckCircle2 } from 'lucide-react';

export default function AdminCMS() {
  const { cmsContent, saveCmsContent } = useStore();
  const [formData, setFormData] = useState<CMSContent>(cmsContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    setFormData(cmsContent);
  }, [cmsContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCmsContent(formData);
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setIsSaving(false);
    }
  };

  const updateHero = (field: keyof CMSContent['hero'], value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateAboutUs = (field: keyof CMSContent['aboutUs'], value: string) => {
    setFormData(prev => ({
      ...prev,
      aboutUs: { ...prev.aboutUs, [field]: value }
    }));
  };

  const updateContactUs = (field: keyof CMSContent['contactUs'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactUs: { ...prev.contactUs, [field]: value }
    }));
  };

  const updatePolicy = (index: number, field: 'title' | 'content', value: string) => {
    setFormData(prev => {
      const newPolicies = [...prev.policies];
      newPolicies[index] = { ...newPolicies[index], [field]: value };
      return { ...prev, policies: newPolicies };
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-1">Update website content and links.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-full gap-2"
        >
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">Hero Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Background Image</Label>
              <ImageUpload 
                value={formData.hero.image} 
                onChange={url => updateHero('image', url as string)}
                bucket="product-media"
              />
            </div>
            <div className="space-y-2">
              <Label>Slogan</Label>
              <Input 
                value={formData.hero.slogan} 
                onChange={e => updateHero('slogan', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.hero.title} 
                onChange={e => updateHero('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.hero.description} 
                onChange={e => updateHero('description', e.target.value)}
                className="h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={formData.hero.buttonText} 
                  onChange={e => updateHero('buttonText', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Button Link</Label>
                <Input 
                  value={formData.hero.buttonLink} 
                  onChange={e => updateHero('buttonLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">About Us Section</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>About Us Image</Label>
              <ImageUpload 
                value={formData.aboutUs.image} 
                onChange={url => updateAboutUs('image', url as string)}
                bucket="product-media"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={formData.aboutUs.title} 
                onChange={e => updateAboutUs('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                value={formData.aboutUs.content} 
                onChange={e => updateAboutUs('content', e.target.value)}
                className="h-48"
              />
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                value={formData.contactUs.email} 
                onChange={e => updateContactUs('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={formData.contactUs.phone} 
                onChange={e => updateContactUs('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea 
                value={formData.contactUs.address} 
                onChange={e => updateContactUs('address', e.target.value)}
                className="h-24"
              />
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm space-y-6 lg:col-span-2">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">Policies (Homepage Features)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formData.policies.map((policy, index) => (
              <div key={index} className="space-y-4 p-4 border border-border/50 rounded-xl bg-secondary/5">
                <div className="space-y-2">
                  <Label>Title {index + 1}</Label>
                  <Input 
                    value={policy.title} 
                    onChange={e => updatePolicy(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content {index + 1}</Label>
                  <Textarea 
                    value={policy.content} 
                    onChange={e => updatePolicy(index, 'content', e.target.value)}
                    className="h-24"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Footer (Simplified for brevity) */}
        <div className="bg-background p-6 rounded-2xl border border-border/50 premium-shadow-sm space-y-6">
          <h2 className="text-xl font-bold border-b border-border/50 pb-4">Global Settings & SEO</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input 
                value={formData.seo.title} 
                onChange={e => setFormData(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea 
                value={formData.seo.description} 
                onChange={e => setFormData(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                className="h-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Promo Banner Text</Label>
              <Input 
                value={formData.navigation.promoText} 
                onChange={e => setFormData(prev => ({ ...prev, navigation: { ...prev.navigation, promoText: e.target.value } }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Footer Description</Label>
              <Textarea 
                value={formData.footer.description} 
                onChange={e => setFormData(prev => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }))}
                className="h-24"
              />
            </div>
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input 
                value={formData.footer.copyright} 
                onChange={e => setFormData(prev => ({ ...prev, footer: { ...prev.footer, copyright: e.target.value } }))}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
