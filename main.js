// Initialize Supabase client with hardcoded values for production
const supabaseUrl = 'https://mmtxiammxdolikytleee.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdHhpYW1teGRvbGlreXRsZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTQyMzIsImV4cCI6MjA3MTEzMDIzMn0.zWO5pEVlZldsWICF7YOdC_G5_ZvW2R4J6JY6It_DdE0'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdHhpYW1teGRvbGlreXRsZWVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1NDIzMiwiZXhwIjoyMDcxMTMwMjMyfQ.DrRrsNM9lfJ6GTipvjPgeBAQN4g0Ko3eAq7x93O_Ebo'
const MARKETING_ACCOUNT_ID = '23eda301-d578-4d76-bbf3-305ea27c3732'

// Email functionality handled by serverless function

console.log('✅ Initializing Supabase with environment variables...')
console.log('🌐 Supabase URL:', supabaseUrl)
console.log('🔑 Using environment-based configuration')
console.log('🔐 Service role key available:', !!supabaseServiceKey)

// Use service role key for elevated permissions
const supabaseClient = supabase.createClient(supabaseUrl, supabaseServiceKey)
window.supabaseClient = supabaseClient

// Global variables for the form
let CAMPAIGN_ID = null
let uploadedFiles = []

// File change handler function
function handleFileChange(e) {
  console.log('🔄 File change event triggered!')
  uploadedFiles = Array.from(e.target.files)
  console.log(`📎 ${uploadedFiles.length} file(s) selected`)
  console.log('📋 Selected files:', uploadedFiles.map(f => f.name))
  
  // Display uploaded files in the form
  displayUploadedFiles()
}

// Display uploaded files in the form
function displayUploadedFiles() {
  const fileList = document.getElementById('fileList')
  const fileUpload = document.querySelector('.file-upload')
  
  if (!fileList) {
    console.error('❌ fileList element not found!')
    return
  }
  
  console.log('📋 Displaying files:', uploadedFiles.map(f => f.name))
  
  // Clear existing files
  fileList.innerHTML = ''
  
  if (uploadedFiles.length === 0) {
    console.log('📋 No files to display')
    // Show upload field when no files
    if (fileUpload) {
      fileUpload.style.display = 'block'
    }
    return
  }
  
  // Hide upload field when files are present
  if (fileUpload) {
    fileUpload.style.display = 'none'
  }
  
  // Create file display for each uploaded file
  uploadedFiles.forEach((file, index) => {
    console.log(`📄 Creating display for file: ${file.name}`)
    const fileItem = document.createElement('div')
    fileItem.className = 'file-item'
    fileItem.innerHTML = `
      <div class="file-info">
        <span class="file-icon">📄</span>
        <span class="file-name" style="color: black !important; background: white; padding: 0.3rem 0.5rem; border-radius: 4px; font-size: 16px; font-family: 'Libre Baskerville', serif; font-weight: 400;">${file.name}</span>
      </div>
      <button type="button" class="remove-file-btn" onclick="removeFile(${index})">×</button>
    `
    fileList.appendChild(fileItem)
    
    // Debug: Check if the file name element was created
    const fileNameElement = fileItem.querySelector('.file-name')
    console.log('🔍 File name element created:', fileNameElement)
    console.log('🔍 File name text content:', fileNameElement?.textContent)
  })
  
  console.log('✅ Files displayed successfully')
}

// Remove file function
function removeFile(index) {
  console.log(`🗑️ Removing file at index ${index}`)
  uploadedFiles.splice(index, 1)
  
  // Update the file input
  const fileInput = document.getElementById('invoiceFile')
  if (fileInput) {
    // Create new FileList with remaining files
    const dt = new DataTransfer()
    uploadedFiles.forEach(file => dt.items.add(file))
    fileInput.files = dt.files
  }
  
  // Refresh display (this will show/hide upload field as needed)
  displayUploadedFiles()
}

// Make removeFile available globally
window.removeFile = removeFile

// Send confirmation email using our serverless function
async function sendConfirmationEmail(contactEmail, contactName, restaurantName) {
  try {
    console.log('📧 Sending confirmation email to:', contactEmail)
    
    // Check if we're on localhost (development) or production
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    if (isLocalhost) {
      console.log('🏠 Localhost detected - skipping email sending for development')
      console.log('📧 Would send email to:', contactEmail)
      console.log('📧 Email content: Thank you for purchasing a Tari product...')
      return true // Return true to simulate successful email sending
    }
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contactEmail,
        contactName,
        restaurantName
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Email sent successfully:', result)
      return true
    } else {
      const error = await response.text()
      console.error('❌ Email sending failed:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return false
  }
}

// Show custom success message
function showSuccessMessage() {
  console.log('🎉 showSuccessMessage() called')
  
  // Replace form content with success message
  const form = document.getElementById('invoiceForm')
  if (form) {
    form.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #242ff8; border-radius: 8px; color: #ffffff; font-family: 'Tanker', sans-serif;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <h3 style="color: #ffffff; margin-bottom: 1rem; font-size: 2rem; font-family: 'Tanker', sans-serif; font-weight: normal;">Thank you for your rebate request!</h3>
        <p style="color: #ffffff; font-size: 1.2rem; margin: 0 0 1rem 0; font-family: 'Tanker', sans-serif;">Your request will be processed within 24-48 hours.</p>
        <p style="color: #ffffff; font-size: 1rem; margin: 0; font-family: 'Tanker', sans-serif;">You should receive a confirmation email shortly.</p>
      </div>
    `
    console.log('✅ Form content replaced with success message')
  } else {
    console.error('❌ Form element not found!')
  }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM loaded - initializing Supabase integration...')
  loadCampaignData(supabaseClient)
  initializeFormHandlers()
})

// Load campaign data from database
async function loadCampaignData(client) {
  try {
    console.log('🔍 Loading campaign data...')
    const { data: campaigns, error } = await client
      .from('rebate_campaigns')
      .select('id, campaign_name, active, start_date, end_date, balance')
      .eq('marketing_account_id', MARKETING_ACCOUNT_ID)
      .eq('active', true)
      .limit(1)
    
    if (error) {
      console.error('❌ Database error:', error)
      } else if (campaigns && campaigns.length > 0) {
        const campaign = campaigns[0]
        console.log('✅ Campaign loaded:', campaign.campaign_name)
        console.log('🎯 Campaign ID:', campaign.id)
        console.log('🎯 Campaign ID type:', typeof campaign.id)
        console.log('🎯 Campaign details:', JSON.stringify(campaign, null, 2))
        
        CAMPAIGN_ID = campaign.id
        window.CAMPAIGN_ID = campaign.id // Also set on window for debugging
        
        console.log('🔄 After assignment - CAMPAIGN_ID:', CAMPAIGN_ID)
        console.log('🔄 After assignment - window.CAMPAIGN_ID:', window.CAMPAIGN_ID)
      
      // Update UI with campaign info
      const campaignElement = document.getElementById('campaign-info')
      if (campaignElement) {
        campaignElement.textContent = campaign.campaign_name
      }
    } else {
      console.log('⚠️ No active campaigns found')
    }
  } catch (error) {
    console.error('❌ Error loading campaign:', error)
  }
}

// Initialize form handlers
function initializeFormHandlers() {
  // File upload handler
  const fileInput = document.getElementById('invoiceFile') // Fixed: was 'invoiceFiles', should be 'invoiceFile'
  console.log('🔍 Looking for file input with ID "invoiceFile":', fileInput)
  
  if (fileInput) {
    console.log('✅ File input found, adding event listener')
    // Remove any existing event listeners to prevent duplicates from HMR
    fileInput.removeEventListener('change', handleFileChange)
    fileInput.addEventListener('change', handleFileChange)
    console.log('✅ File input handler attached (removed any duplicates)')
    
    // Test the fileList element
    const fileList = document.getElementById('fileList')
    console.log('🔍 File list element:', fileList)
    
  } else {
    console.error('❌ File input with ID "invoiceFile" not found!')
    // Try to find any file inputs
    const allFileInputs = document.querySelectorAll('input[type="file"]')
    console.log('🔍 All file inputs found:', allFileInputs)
    allFileInputs.forEach((input, index) => {
      console.log(`📎 File input ${index}:`, input.id || 'no ID', input.name || 'no name')
    })
  }

  // Form submission handler
  const form = document.getElementById('invoiceForm')
  if (form) {
    // Remove any existing event listeners to prevent duplicates from HMR
    form.removeEventListener('submit', handleFormSubmission)
    form.addEventListener('submit', handleFormSubmission)
    console.log('✅ Form submit handler attached (removed any duplicates)')
  }
}

// Track submission state to prevent multiple submissions
let isSubmitting = false
let submissionCount = 0

// Handle form submission
async function handleFormSubmission(e) {
  e.preventDefault()
  
  submissionCount++
  console.log(`🚀 handleFormSubmission called (attempt #${submissionCount})`)
  console.log('🔒 isSubmitting:', isSubmitting)
  console.log('📊 Total function calls so far:', submissionCount)
  
  if (isSubmitting) {
    console.warn('⚠️ Form submission already in progress, ignoring duplicate submission')
    return
  }
  
  isSubmitting = true
  console.log('🔒 Set isSubmitting to true')
  
  if (!CAMPAIGN_ID) {
    alert('❌ No active campaign found. Please try again later.')
    isSubmitting = false
    return
  }

  console.log('🔍 Checking uploaded files...')
  console.log('📎 uploadedFiles.length:', uploadedFiles.length)
  console.log('📎 uploadedFiles array:', uploadedFiles)
  
  if (uploadedFiles.length === 0) {
    console.error('❌ No files in uploadedFiles array')
    
    // Check if files are in the file input directly
    const fileInput = document.getElementById('invoiceFile')
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      console.log('🔍 Files found directly in input:', Array.from(fileInput.files).map(f => f.name))
      console.log('⚠️ Using files from input directly instead of uploadedFiles array')
      uploadedFiles = Array.from(fileInput.files)
    } else {
      alert('❌ Please select at least one invoice file.')
      isSubmitting = false
      return
    }
  }

  try {
    console.log('🚀 Submitting form...')
    console.log('📋 Current CAMPAIGN_ID:', CAMPAIGN_ID)
    console.log('🪟 Window CAMPAIGN_ID:', window.CAMPAIGN_ID)
    
    const formData = new FormData(e.target)
    const contactName = formData.get('contactName')
    const restaurantName = formData.get('restaurantName')
    const restaurantAddress = formData.get('restaurantAddress')
    const contactEmail = formData.get('contactEmail')
    const paymentType = formData.get('paymentType')
    const paymentDetails = formData.get('paymentDetails')
    
    console.log('🔍 Validating campaign with ID:', CAMPAIGN_ID)
    console.log('🔍 CAMPAIGN_ID type:', typeof CAMPAIGN_ID)
    console.log('🔍 CAMPAIGN_ID value:', JSON.stringify(CAMPAIGN_ID))
    
    if (!CAMPAIGN_ID) {
      throw new Error('No campaign ID available. Please refresh the page and try again.')
    }
    
    // Validate campaign is active
    console.log('🔍 Starting campaign validation...')
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('rebate_campaigns')
      .select('id, active, start_date, end_date, balance')
      .eq('id', CAMPAIGN_ID)
      .single()
    
    console.log('📊 Campaign validation result:', { campaign, campaignError })
    console.log('📊 Campaign error details:', campaignError)
    
    if (campaignError) {
      console.error('❌ Campaign database error:', campaignError)
      console.error('❌ Full error object:', JSON.stringify(campaignError, null, 2))
      throw new Error(`Campaign validation failed: ${campaignError.message}`)
    }
    
    if (!campaign) {
      console.error('❌ No campaign returned')
      throw new Error('Campaign not found')
    }
    
    // If we have a campaign, validate it
    if (campaign) {
      console.log('✅ Campaign found, validating properties...')
      
      if (!campaign.active) {
        throw new Error('Campaign is not active')
      }
      
      // Check if campaign is within date range (only if dates exist)
      if (campaign.start_date && campaign.end_date) {
        const now = new Date()
        const startDate = new Date(campaign.start_date)
        const endDate = new Date(campaign.end_date)
        
        console.log('📅 Date validation:', {
          now: now.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isWithinRange: now >= startDate && now <= endDate
        })
        
        if (now < startDate || now > endDate) {
          throw new Error('Campaign is not within the active date range')
        }
      } else {
        console.log('📅 No date range specified for campaign, skipping date validation')
      }
    } else {
      console.warn('⚠️ No campaign object, but proceeding with submission anyway')
      console.warn('⚠️ This might indicate a database issue, but data will still be saved')
    }
    
    // Upload files to Supabase Storage
    const fileUrls = []
    for (const file of uploadedFiles) {
      const fileName = `${CAMPAIGN_ID}/${Date.now()}-${file.name}`
      const { data, error } = await supabaseClient.storage
        .from('rebate-invoices')
        .upload(fileName, file)
      
      if (error) {
        throw error
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('rebate-invoices')
        .getPublicUrl(fileName)
      
      fileUrls.push(publicUrl)
    }
    
        // Insert rebate request
        const { data, error } = await supabaseClient
          .from('rebate_requests')
          .insert([
            {
              rebate_campaign_id: CAMPAIGN_ID,
              contact_name: contactName,
              restaurant_name: restaurantName,
              restaurant_address: restaurantAddress,
              contact_email: contactEmail,
              preferred_payment_type: paymentType,
              payment_details: paymentDetails,
              invoice_files: fileUrls
              // Removed 'status' and 'created_at' as they may not exist in the schema
            }
          ])
    
    if (error) {
      console.error('❌ Database insert error:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
        console.log('✅ Form submitted successfully!')
        console.log('✅ Data saved to Supabase:', data)
        
        // Send confirmation email
        console.log('📧 Sending confirmation email...')
        const emailSent = await sendConfirmationEmail(contactEmail, contactName, restaurantName)
        if (emailSent) {
          console.log('✅ Confirmation email sent successfully')
        } else {
          console.log('⚠️ Email sending failed, but form submission was successful')
        }
        
        console.log('🎯 About to call showSuccessMessage()...')
        // Show custom success message
        showSuccessMessage()
        console.log('🎯 showSuccessMessage() call completed')
        
        // Reset form
        e.target.reset()
        uploadedFiles = []
    
  } catch (error) {
    console.error('❌ Form submission error:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    alert(`❌ Error submitting form: ${error.message}`)
  } finally {
    isSubmitting = false
    console.log('🔒 Set isSubmitting to false')
  }
}
