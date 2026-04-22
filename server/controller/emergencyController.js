// Node-fetch is an ESM module and cannot be required in CommonJS.
// Since Node v18+, native fetch is available globally.


// If using Node 18+, fetch is natively available. 
// Note: If 'node-fetch' isn't explicitly defined, we can just rely on the global native fetch.

exports.getEmergencyByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const apiUrl = process.env.COUNTRY_EMERGENCY_API || 'https://emergencynumberapi.com/api/country/';
    
    const response = await fetch(`${apiUrl}${countryCode}`);
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'Failed to fetch emergency contact intelligence' });
    }
    
    const data = await response.json();
    return res.status(200).json({ success: true, data: data.data });
  } catch (error) {
    console.error('Emergency API Sync Error:', error);
    return res.status(500).json({ success: false, message: 'Server matrix fault while obtaining emergency protocol' });
  }
};
