import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  FileText,
  Map,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Easy Complaint Filing',
    description: 'Report civic issues in minutes with our simple form. Add photos, location, and track progress.',
  },
  {
    icon: Map,
    title: 'Real-time Tracking',
    description: 'Track your complaint status in real-time with our interactive map and timeline view.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Analytics',
    description: 'View city-wide statistics, resolution times, and department performance metrics.',
  },
  {
    icon: Users,
    title: 'Multi-role Access',
    description: 'Dedicated dashboards for citizens, officers, department heads, and administrators.',
  },
];

const stats = [
  { value: '50K+', label: 'Complaints Resolved' },
  { value: '24hrs', label: 'Avg. Response Time' },
  { value: '95%', label: 'Citizen Satisfaction' },
  { value: '15+', label: 'City Departments' },
];

const services = [
  { icon: '🛣️', name: 'Roads & Potholes' },
  { icon: '💧', name: 'Water Supply' },
  { icon: '⚡', name: 'Electricity' },
  { icon: '🗑️', name: 'Garbage Collection' },
  { icon: '💡', name: 'Street Lights' },
  { icon: '🌳', name: 'Parks & Gardens' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">CitiCare</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Municipal Portal
                </p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/documents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documents
              </Link>
              <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="accent">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--accent)/0.1),_transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              <Zap className="h-3 w-3 mr-1" />
              Trusted by 100,000+ Citizens
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
              Your Voice,{' '}
              <span className="text-accent">Our Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              CitiCare connects citizens with municipal services. Report issues, track resolutions, 
              and help build a better city together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/register">
                <Button variant="hero" size="xl">
                  File a Complaint
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl">
                  Track Existing Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Report issues across various civic categories. Our dedicated teams are ready to address your concerns.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <div
                key={service.name}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-4xl mb-3 block">{service.icon}</span>
                <p className="text-sm font-medium">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CitiCare?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern platform designed to streamline civic services and improve citizen experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your civic issues resolved.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Register & Report', desc: 'Create an account and submit your complaint with details and photos.' },
              { step: '2', title: 'Track Progress', desc: 'Monitor your complaint status in real-time through our timeline view.' },
              { step: '3', title: 'Get Resolution', desc: 'Receive updates and provide feedback once the issue is resolved.' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are actively improving their neighborhoods through CitiCare.
          </p>
          <Link to="/register">
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">CitiCare</h3>
                  <p className="text-xs text-muted-foreground">Municipal Portal</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering citizens to build better cities through transparent and efficient civic services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-foreground transition-colors">Register</Link></li>
                <li><Link to="/documents" className="hover:text-foreground transition-colors">Documents</Link></li>
                <li><Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Roads & Infrastructure</li>
                <li>Water Supply</li>
                <li>Electricity</li>
                <li>Sanitation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  1800-XXX-XXXX
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@citicare.gov
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Mon-Sat: 9AM - 6PM
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 CitiCare Municipal Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
