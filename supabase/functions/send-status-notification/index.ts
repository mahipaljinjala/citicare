import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusNotificationRequest {
  complaint_id: string;
  old_status: string;
  new_status: string;
  complaint_number: string;
  complaint_title: string;
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
    closed: "Closed",
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "#f59e0b",
    in_progress: "#3b82f6",
    resolved: "#10b981",
    rejected: "#ef4444",
    closed: "#6b7280",
  };
  return colors[status] || "#6b7280";
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Send status notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { complaint_id, old_status, new_status, complaint_number, complaint_title }: StatusNotificationRequest = await req.json();

    console.log(`Processing notification for complaint ${complaint_number}: ${old_status} -> ${new_status}`);

    // Get the complaint creator's email
    const { data: complaint, error: complaintError } = await supabase
      .from("complaints")
      .select("user_id")
      .eq("id", complaint_id)
      .single();

    if (complaintError || !complaint) {
      console.error("Error fetching complaint:", complaintError);
      throw new Error("Complaint not found");
    }

    // Get user profile and check notification preferences
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name, notification_email, notification_status_updates")
      .eq("id", complaint.user_id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile:", profileError);
      throw new Error("User profile not found");
    }

    // Check if user wants email notifications for status updates
    if (!profile.notification_email || !profile.notification_status_updates) {
      console.log("User has disabled status update notifications");
      return new Response(
        JSON.stringify({ success: true, message: "User has disabled notifications" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h1 style="color: #18181b; font-size: 24px; margin: 0 0 16px 0;">Complaint Status Updated</h1>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                Hello ${profile.full_name || "there"},
              </p>
              
              <p style="color: #52525b; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                The status of your complaint has been updated:
              </p>
              
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="color: #71717a; font-size: 14px; margin: 0 0 4px 0;">Complaint Number</p>
                <p style="color: #18181b; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">${complaint_number}</p>
                
                <p style="color: #71717a; font-size: 14px; margin: 0 0 4px 0;">Title</p>
                <p style="color: #18181b; font-size: 16px; margin: 0 0 16px 0;">${complaint_title}</p>
                
                <p style="color: #71717a; font-size: 14px; margin: 0 0 8px 0;">Status Change</p>
                <div>
                  <span style="background-color: ${getStatusColor(old_status)}20; color: ${getStatusColor(old_status)}; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; display: inline-block;">
                    ${getStatusLabel(old_status)}
                  </span>
                  <span style="color: #71717a; margin: 0 8px;">→</span>
                  <span style="background-color: ${getStatusColor(new_status)}20; color: ${getStatusColor(new_status)}; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; display: inline-block;">
                    ${getStatusLabel(new_status)}
                  </span>
                </div>
              </div>
              
              <p style="color: #52525b; font-size: 14px; line-height: 1.5; margin: 0;">
                Thank you for using Surat Municipal Corporation Complaint Portal.
              </p>
            </div>
            
            <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin-top: 24px;">
              This is an automated notification. Please do not reply to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CitiCare <onboarding@resend.dev>",
        to: [profile.email],
        subject: `Complaint ${complaint_number} - Status Updated to ${getStatusLabel(new_status)}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, emailResponse: emailResult }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-status-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
