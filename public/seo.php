<?php
/**
 * Erranders Dynamic SEO Interceptor for Social Media Bots
 */

// 1. Get the requested Host
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

// 2. Extract subdomain
$parts = explode('.', $host);
$subdomain = '';

// Check if there is a valid subdomain (e.g. glam-sarah.erranders.org)
if (count($parts) >= 3) {
    $subdomain = $parts[0];
}

$title = "Errander — Student Portal";
$description = "Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.";
$imageUrl = "https://res.cloudinary.com/marquis/image/upload/v1780940566/logo-light_pyjwmn.png";

// Common subdomains to ignore
$ignoreSubdomains = ['www', 'student', 'vendor', 'errandr-student', 'dispatch', 'api'];

if ($subdomain && !in_array($subdomain, $ignoreSubdomains)) {
    // 3. Fetch vendor data from the backend API
    $apiUrl = "https://api.erranders.org/vendors/subdomain/" . urlencode($subdomain);
    
    // Set a timeout so we don't hang the bot if the API is slow
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 3
        ]
    ]);

    $response = @file_get_contents($apiUrl, false, $context);
    
    if ($response !== false) {
        $vendor = json_decode($response, true);
        if ($vendor && !isset($vendor['error'])) {
            $storeName = htmlspecialchars($vendor['storeName'] ?? 'Vendor');
            $title = "{$storeName} | Errander";
            
            $vendorDesc = htmlspecialchars($vendor['description'] ?? '');
            $description = $vendorDesc ? $vendorDesc : "Order food, groceries, and essentials from {$storeName}. Delivered right to your hostel.";
            
            $imageUrl = $vendor['bannerUrl'] ?? ($vendor['logoUrl'] ?? $imageUrl);
        }
    }
}

// 4. Output the HTML with Meta Tags
$requestUri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
$canonicalUrl = "https://" . htmlspecialchars($host) . htmlspecialchars($requestUri);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $title; ?></title>
    
    <!-- Essential Meta Tags -->
    <meta name="description" content="<?php echo $description; ?>">
    <link rel="canonical" href="<?php echo $canonicalUrl; ?>">
    
    <!-- OpenGraph Tags -->
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $imageUrl; ?>">
    <meta property="og:url" content="<?php echo $canonicalUrl; ?>">
    <meta property="og:type" content="website">
    
    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo $title; ?>">
    <meta name="twitter:description" content="<?php echo $description; ?>">
    <meta name="twitter:image" content="<?php echo $imageUrl; ?>">
</head>
<body>
    <!-- 
      This page is served exclusively to social media bots to provide dynamic SEO preview cards.
      If you are seeing this, you are a bot, or your User-Agent matched our bot list.
    -->
    <script>
        // Fallback redirect for real users who accidentally get here
        window.location.replace('/');
    </script>
</body>
</html>
