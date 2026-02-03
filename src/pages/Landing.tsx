import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  FileText,
  Map,
  BarChart3,
  Users,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  Shield,
  Megaphone,
  BookOpen,
  Globe,
  ChevronRight,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle2,
  Landmark,
  Database,
  FileCheck,
  Accessibility,
  Sun,
  Moon,
} from 'lucide-react';

const quickLinks = [
  { icon: FileText, title: 'File Complaint', description: 'Report civic issues', href: '/complaints/new', color: 'bg-primary' },
  { icon: FileCheck, title: 'Track Status', description: 'Check complaint status', href: '/login', color: 'bg-success' },
  { icon: Database, title: 'Open Data', description: 'Government datasets', href: '/analytics', color: 'bg-info' },
  { icon: BookOpen, title: 'Documents', description: 'Public documents', href: '/documents', color: 'bg-accent' },
  { icon: Building2, title: 'Departments', description: 'Municipal services', href: '/departments', color: 'bg-warning' },
  { icon: Map, title: 'City Map', description: 'View complaints map', href: '/map', color: 'bg-primary' },
];

const services = [
  { icon: '🛣️', name: 'Roads & Potholes', count: 2847, dept: 'PWD' },
  { icon: '💧', name: 'Water Supply', count: 1523, dept: 'Water Works' },
  { icon: '⚡', name: 'Electricity', count: 982, dept: 'Electricity' },
  { icon: '🗑️', name: 'Garbage Collection', count: 1847, dept: 'Sanitation' },
  { icon: '💡', name: 'Street Lights', count: 623, dept: 'PWD' },
  { icon: '🌳', name: 'Parks & Gardens', count: 412, dept: 'Horticulture' },
  { icon: '🏗️', name: 'Building Permits', count: 328, dept: 'Town Planning' },
  { icon: '🚌', name: 'Public Transport', count: 567, dept: 'Transport' },
];

const announcements = [
  { title: 'Water supply disruption in Zone 3 on Feb 5th for maintenance', date: '2 hours ago', urgent: true },
  { title: 'New online portal launched for building permit applications', date: '1 day ago', urgent: false },
  { title: 'Municipal tax payment deadline extended to March 31st', date: '2 days ago', urgent: false },
  { title: 'Smart City project Phase 2 inaugurated by Hon. Mayor', date: '3 days ago', urgent: false },
];

const stats = [
  { value: '2.5L+', label: 'Complaints Resolved', icon: CheckCircle2 },
  { value: '24hrs', label: 'Avg Response Time', icon: Clock },
  { value: '98%', label: 'Citizen Satisfaction', icon: Users },
  { value: '15+', label: 'Departments', icon: Building2 },
];

const departments = [
  { name: 'Public Works Department', shortName: 'PWD', complaints: 3847 },
  { name: 'Water Supply & Sewerage', shortName: 'WSS', complaints: 1523 },
  { name: 'Sanitation Department', shortName: 'SAN', complaints: 1847 },
  { name: 'Town Planning', shortName: 'TP', complaints: 892 },
  { name: 'Revenue Department', shortName: 'REV', complaints: 456 },
  { name: 'Health Department', shortName: 'HLT', complaints: 623 },
];

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Top Government Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                भारत सरकार | Government of India
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="flex items-center gap-1 hover:underline">
                <Accessibility className="h-3 w-3" />
                Accessibility
              </button>
              <span>|</span>
              <button className="hover:underline">A-</button>
              <button className="hover:underline font-bold">A</button>
              <button className="hover:underline">A+</button>
              <span>|</span>
              <button className="hover:underline">English</button>
              <button className="hover:underline">हिंदी</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor Stripe */}
      <div className="flex h-1">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-india-green" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Ashoka Chakra inspired logo */}
                <div className="relative h-14 w-14 rounded-full border-4 border-primary flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary font-display">CitiCare Portal</h1>
                  <p className="text-xs text-muted-foreground">
                    Smart Municipal Corporation
                  </p>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '#services' },
                { label: 'Departments', href: '/departments' },
                { label: 'Documents', href: '/documents' },
                { label: 'Projects', href: '/projects' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* News Ticker */}
      <div className="bg-accent/10 border-b border-accent/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded shrink-0">
              <Megaphone className="h-3 w-3" />
              Latest
            </div>
            <div className="overflow-hidden flex-1 ml-4">
              <div className="news-ticker whitespace-nowrap text-sm text-foreground">
                {announcements.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-2 mr-12">
                    {a.urgent && <AlertCircle className="h-3 w-3 text-destructive" />}
                    {a.title}
                    <span className="text-muted-foreground text-xs">({a.date})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-accent-foreground border-0 px-4 py-1.5 text-sm animate-fade-in">
              <Globe className="h-4 w-4 mr-2" />
              Smart City Initiative
            </Badge>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display mb-6 animate-slide-up leading-tight">
              Citizen Services at Your
              <span className="block text-accent">Fingertips</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              One unified platform for all municipal services. Report issues, track progress, 
              access documents, and engage with your city administration.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for services, schemes, documents, or complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-32 text-foreground text-base bg-card border-0 shadow-lg rounded-xl"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg">
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
              <span className="text-primary-foreground/60">Popular:</span>
              {['Water Complaint', 'Property Tax', 'Birth Certificate', 'Building Permit'].map((term) => (
                <button key={term} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={link.title}
                to={link.href}
                className="group bg-card rounded-xl shadow-md hover:shadow-xl transition-all p-5 text-center border border-border animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-12 w-12 ${link.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <link.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground">Civic Services</h2>
              <p className="text-muted-foreground mt-2">Report issues across various municipal categories</p>
            </div>
            <Link to="/complaints/new">
              <Button variant="outline" className="hidden md:flex">
                View All Services
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <Link
                key={service.name}
                to="/complaints/new"
                className="group govt-card p-5 hover:-translate-y-1 transition-all animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{service.icon}</span>
                  <Badge variant="secondary" className="text-xs">
                    {service.count.toLocaleString()}
                  </Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground">{service.dept}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two Column Section - Announcements & Departments */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Announcements */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border bg-primary/5">
                <h3 className="font-semibold flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-accent" />
                  Announcements & Updates
                </h3>
                <Link to="#" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-border">
                {announcements.map((announcement, index) => (
                  <div key={index} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      {announcement.urgent ? (
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium leading-tight">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border bg-primary/5">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Municipal Departments
                </h3>
                <Link to="/departments" className="text-sm text-primary hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-border">
                {departments.map((dept, index) => (
                  <Link key={index} to="/departments" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{dept.shortName}</span>
                      </div>
                      <span className="text-sm font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{dept.complaints}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get your civic issues resolved through our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Register', desc: 'Create your citizen account with basic details', icon: Users },
              { step: '2', title: 'Report Issue', desc: 'Submit your complaint with photos & location', icon: FileText },
              { step: '3', title: 'Track Progress', desc: 'Monitor status updates in real-time', icon: BarChart3 },
              { step: '4', title: 'Resolution', desc: 'Get notified when issue is resolved', icon: CheckCircle2 },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 relative">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Landmark className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h2 className="text-2xl md:text-4xl font-bold font-display mb-4">
              Your City, Your Voice
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join lakhs of citizens actively improving their neighborhoods. 
              Together, we can build a smarter, cleaner, and more efficient city.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Track Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-primary-foreground pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-display">CitiCare Portal</h3>
                  <p className="text-xs text-primary-foreground/70">Smart Municipal Corporation</p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">
                A unified digital platform connecting citizens with municipal services for transparent and efficient governance.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><Link to="/login" className="hover:text-white transition-colors">Citizen Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">New Registration</Link></li>
                <li><Link to="/complaints/new" className="hover:text-white transition-colors">File Complaint</Link></li>
                <li><Link to="/documents" className="hover:text-white transition-colors">Public Documents</Link></li>
                <li><Link to="/projects" className="hover:text-white transition-colors">City Projects</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-accent">Services</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>Roads & Infrastructure</li>
                <li>Water Supply</li>
                <li>Electricity</li>
                <li>Sanitation</li>
                <li>Building Permits</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-accent">Contact Us</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  1800-XXX-XXXX (Toll Free)
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  support@citicare.gov.in
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  Municipal Corporation Office,<br />
                  City Centre, India
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  Mon-Sat: 9:00 AM - 6:00 PM
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
              <p>© 2024 CitiCare Portal. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="#" className="hover:text-white transition-colors">Accessibility</Link>
                <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
              </div>
            </div>
            <div className="text-center mt-4 text-xs text-primary-foreground/40">
              Website designed & developed by National Informatics Centre (NIC)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}