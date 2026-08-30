export interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  format: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // A
  { name: 'Afghanistan', code: 'AF', dialCode: '+93', flag: '🇦🇫', format: '## ### ####' },
  { name: 'Albania', code: 'AL', dialCode: '+355', flag: '🇦🇱', format: '### ### ###' },
  { name: 'Algeria', code: 'DZ', dialCode: '+213', flag: '🇩🇿', format: '## ### ####' },
  { name: 'Andorra', code: 'AD', dialCode: '+376', flag: '🇦🇩', format: '### ###' },
  { name: 'Angola', code: 'AO', dialCode: '+244', flag: '🇦🇴', format: '### ### ###' },
  { name: 'Antigua and Barbuda', code: 'AG', dialCode: '+1268', flag: '🇦🇬', format: '### ####' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', format: '## ####-####' },
  { name: 'Armenia', code: 'AM', dialCode: '+374', flag: '🇦🇲', format: '## ######' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', format: '### ### ###' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹', format: '### #######' },
  { name: 'Azerbaijan', code: 'AZ', dialCode: '+994', flag: '🇦🇿', format: '## ### ## ##' },

  // B
  { name: 'Bahamas', code: 'BS', dialCode: '+1242', flag: '🇧🇸', format: '### ####' },
  { name: 'Bahrain', code: 'BH', dialCode: '+973', flag: '🇧🇭', format: '#### ####' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', format: '#### ######' },
  { name: 'Barbados', code: 'BB', dialCode: '+1246', flag: '🇧🇧', format: '### ####' },
  { name: 'Belarus', code: 'BY', dialCode: '+375', flag: '🇧🇾', format: '## ### ## ##' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', format: '### ## ## ##' },
  { name: 'Belize', code: 'BZ', dialCode: '+501', flag: '🇧🇿', format: '###-####' },
  { name: 'Benin', code: 'BJ', dialCode: '+229', flag: '🇧🇯', format: '## ## ## ##' },
  { name: 'Bhutan', code: 'BT', dialCode: '+975', flag: '🇧🇹', format: '# ### ###' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴', format: '# ### ####' },
  { name: 'Bosnia and Herzegovina', code: 'BA', dialCode: '+387', flag: '🇧🇦', format: '## ### ###' },
  { name: 'Botswana', code: 'BW', dialCode: '+267', flag: '🇧🇼', format: '## ### ###' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', format: '## #####-####' },
  { name: 'Brunei', code: 'BN', dialCode: '+673', flag: '🇧🇳', format: '### ####' },
  { name: 'Bulgaria', code: 'BG', dialCode: '+359', flag: '🇧🇬', format: '## ### ###' },
  { name: 'Burkina Faso', code: 'BF', dialCode: '+226', flag: '🇧🇫', format: '## ## ## ##' },
  { name: 'Burundi', code: 'BI', dialCode: '+257', flag: '🇧🇮', format: '## ## ## ##' },

  // C
  { name: 'Cambodia', code: 'KH', dialCode: '+855', flag: '🇰🇭', format: '## ### ###' },
  { name: 'Cameroon', code: 'CM', dialCode: '+237', flag: '🇨🇲', format: '#### ####' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####' },
  { name: 'Cape Verde', code: 'CV', dialCode: '+238', flag: '🇨🇻', format: '### ## ##' },
  { name: 'Central African Republic', code: 'CF', dialCode: '+236', flag: '🇨🇫', format: '## ## ## ##' },
  { name: 'Chad', code: 'TD', dialCode: '+235', flag: '🇹🇩', format: '## ## ## ##' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱', format: '# #### ####' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', format: '### #### ####' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴', format: '### #######' },
  { name: 'Comoros', code: 'KM', dialCode: '+269', flag: '🇰🇲', format: '## #####' },
  { name: 'Congo (Republic)', code: 'CG', dialCode: '+242', flag: '🇨🇬', format: '## ### ####' },
  { name: 'Congo (DRC)', code: 'CD', dialCode: '+243', flag: '🇨🇩', format: '### ### ###' },
  { name: 'Costa Rica', code: 'CR', dialCode: '+506', flag: '🇨🇷', format: '#### ####' },
  { name: 'Croatia', code: 'HR', dialCode: '+385', flag: '🇭🇷', format: '## ### ####' },
  { name: 'Cuba', code: 'CU', dialCode: '+53', flag: '🇨🇺', format: '# ### ####' },
  { name: 'Cyprus', code: 'CY', dialCode: '+357', flag: '🇨🇾', format: '## ######' },
  { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '🇨🇿', format: '### ### ###' },

  // D
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', format: '## ## ## ##' },
  { name: 'Djibouti', code: 'DJ', dialCode: '+253', flag: '🇩🇯', format: '## ## ## ##' },
  { name: 'Dominica', code: 'DM', dialCode: '+1767', flag: '🇩🇲', format: '### ####' },
  { name: 'Dominican Republic', code: 'DO', dialCode: '+1809', flag: '🇩🇴', format: '### ####' },

  // E
  { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨', format: '## ### ####' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', format: '### ### ####' },
  { name: 'El Salvador', code: 'SV', dialCode: '+503', flag: '🇸🇻', format: '#### ####' },
  { name: 'Equatorial Guinea', code: 'GQ', dialCode: '+240', flag: '🇬🇶', format: '### ### ###' },
  { name: 'Eritrea', code: 'ER', dialCode: '+291', flag: '🇪🇷', format: '# ### ###' },
  { name: 'Estonia', code: 'EE', dialCode: '+372', flag: '🇪🇪', format: '#### ####' },
  { name: 'Eswatini', code: 'SZ', dialCode: '+268', flag: '🇸🇿', format: '#### ####' },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹', format: '## ### ####' },

  // F
  { name: 'Fiji', code: 'FJ', dialCode: '+679', flag: '🇫🇯', format: '### ####' },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮', format: '### #######' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', format: '# ## ## ## ##' },

  // G
  { name: 'Gabon', code: 'GA', dialCode: '+241', flag: '🇬🇦', format: '## ## ## ##' },
  { name: 'Gambia', code: 'GM', dialCode: '+220', flag: '🇬🇲', format: '### ####' },
  { name: 'Georgia', code: 'GE', dialCode: '+995', flag: '🇬🇪', format: '### ### ###' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', format: '### ########' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', format: '## ### ####' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷', format: '### #######' },
  { name: 'Grenada', code: 'GD', dialCode: '+1473', flag: '🇬🇩', format: '### ####' },
  { name: 'Guatemala', code: 'GT', dialCode: '+502', flag: '🇬🇹', format: '#### ####' },
  { name: 'Guinea', code: 'GN', dialCode: '+224', flag: '🇬🇳', format: '### ## ## ##' },
  { name: 'Guinea-Bissau', code: 'GW', dialCode: '+245', flag: '🇬🇼', format: '### ####' },
  { name: 'Guyana', code: 'GY', dialCode: '+592', flag: '🇬🇾', format: '### ####' },

  // H
  { name: 'Haiti', code: 'HT', dialCode: '+509', flag: '🇭🇹', format: '#### ####' },
  { name: 'Honduras', code: 'HN', dialCode: '+504', flag: '🇭🇳', format: '#### ####' },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰', format: '#### ####' },
  { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺', format: '## ### ####' },

  // I
  { name: 'Iceland', code: 'IS', dialCode: '+354', flag: '🇮🇸', format: '### ####' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', format: '##### #####' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', format: '### #### ####' },
  { name: 'Iran', code: 'IR', dialCode: '+98', flag: '🇮🇷', format: '### ### ####' },
  { name: 'Iraq', code: 'IQ', dialCode: '+964', flag: '🇮🇶', format: '### ### ####' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', format: '## ### ####' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱', format: '## ### ####' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', format: '### #######' },
  { name: 'Ivory Coast', code: 'CI', dialCode: '+225', flag: '🇨🇮', format: '## ## ## ##' },

  // J
  { name: 'Jamaica', code: 'JM', dialCode: '+1876', flag: '🇯🇲', format: '### ####' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', format: '## #### ####' },
  { name: 'Jordan', code: 'JO', dialCode: '+962', flag: '🇯🇴', format: '# #### ####' },

  // K
  { name: 'Kazakhstan', code: 'KZ', dialCode: '+7', flag: '🇰🇿', format: '### ###-##-##' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', format: '### ######' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', format: '#### ####' },
  { name: 'Kyrgyzstan', code: 'KG', dialCode: '+996', flag: '🇰🇬', format: '### ### ###' },

  // L
  { name: 'Laos', code: 'LA', dialCode: '+856', flag: '🇱🇦', format: '## ### ###' },
  { name: 'Latvia', code: 'LV', dialCode: '+371', flag: '🇱🇻', format: '## ### ###' },
  { name: 'Lebanon', code: 'LB', dialCode: '+961', flag: '🇱🇧', format: '## ### ###' },
  { name: 'Lesotho', code: 'LS', dialCode: '+266', flag: '🇱🇸', format: '#### ####' },
  { name: 'Liberia', code: 'LR', dialCode: '+231', flag: '🇱🇷', format: '## ### ####' },
  { name: 'Libya', code: 'LY', dialCode: '+218', flag: '🇱🇾', format: '## ### ####' },
  { name: 'Liechtenstein', code: 'LI', dialCode: '+423', flag: '🇱🇮', format: '### ####' },
  { name: 'Lithuania', code: 'LT', dialCode: '+370', flag: '🇱🇹', format: '### #####' },
  { name: 'Luxembourg', code: 'LU', dialCode: '+352', flag: '🇱🇺', format: '### ### ###' },

  // M
  { name: 'Madagascar', code: 'MG', dialCode: '+261', flag: '🇲🇬', format: '## ## ### ##' },
  { name: 'Malawi', code: 'MW', dialCode: '+265', flag: '🇲🇼', format: '# #### ####' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', format: '##-### ####' },
  { name: 'Maldives', code: 'MV', dialCode: '+960', flag: '🇲🇻', format: '### ####' },
  { name: 'Mali', code: 'ML', dialCode: '+223', flag: '🇲🇱', format: '## ## ## ##' },
  { name: 'Malta', code: 'MT', dialCode: '+356', flag: '🇲🇹', format: '#### ####' },
  { name: 'Mauritania', code: 'MR', dialCode: '+222', flag: '🇲🇷', format: '## ## ## ##' },
  { name: 'Mauritius', code: 'MU', dialCode: '+230', flag: '🇲🇺', format: '#### ####' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', format: '### ### ####' },
  { name: 'Moldova', code: 'MD', dialCode: '+373', flag: '🇲🇩', format: '#### ####' },
  { name: 'Monaco', code: 'MC', dialCode: '+377', flag: '🇲🇨', format: '## ### ###' },
  { name: 'Mongolia', code: 'MN', dialCode: '+976', flag: '🇲🇳', format: '## ## ####' },
  { name: 'Montenegro', code: 'ME', dialCode: '+382', flag: '🇲🇪', format: '## ### ###' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', format: '## ####-###' },
  { name: 'Mozambique', code: 'MZ', dialCode: '+258', flag: '🇲🇿', format: '## ### ####' },
  { name: 'Myanmar', code: 'MM', dialCode: '+95', flag: '🇲🇲', format: '## ### ####' },

  // N
  { name: 'Namibia', code: 'NA', dialCode: '+264', flag: '🇳🇦', format: '## ### ####' },
  { name: 'Nepal', code: 'NP', dialCode: '+977', flag: '🇳🇵', format: '## #######' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', format: '# ########' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', format: '## ### ####' },
  { name: 'Nicaragua', code: 'NI', dialCode: '+505', flag: '🇳🇮', format: '#### ####' },
  { name: 'Niger', code: 'NE', dialCode: '+227', flag: '🇳🇪', format: '## ## ## ##' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', format: '### ### ####' },
  { name: 'North Macedonia', code: 'MK', dialCode: '+389', flag: '🇲🇰', format: '## ### ###' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', format: '### ## ###' },

  // O
  { name: 'Oman', code: 'OM', dialCode: '+968', flag: '🇴🇲', format: '#### ####' },

  // P
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', format: '### #######' },
  { name: 'Palestine', code: 'PS', dialCode: '+970', flag: '🇵🇸', format: '### ### ###' },
  { name: 'Panama', code: 'PA', dialCode: '+507', flag: '🇵🇦', format: '#### ####' },
  { name: 'Papua New Guinea', code: 'PG', dialCode: '+675', flag: '🇵🇬', format: '### ####' },
  { name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾', format: '### ### ###' },
  { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪', format: '### ### ###' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', format: '### ### ####' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱', format: '### ### ###' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', format: '### ### ###' },

  // Q
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', format: '#### ####' },

  // R
  { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴', format: '### ### ###' },
  { name: 'Russia', code: 'RU', dialCode: '+7', flag: '🇷🇺', format: '### ###-##-##' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', format: '### ### ###' },

  // S
  { name: 'Saint Kitts and Nevis', code: 'KN', dialCode: '+1869', flag: '🇰🇳', format: '### ####' },
  { name: 'Saint Lucia', code: 'LC', dialCode: '+1758', flag: '🇱🇨', format: '### ####' },
  { name: 'Saint Vincent', code: 'VC', dialCode: '+1784', flag: '🇻🇨', format: '### ####' },
  { name: 'Samoa', code: 'WS', dialCode: '+685', flag: '🇼🇸', format: '## ####' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', format: '## ### ####' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳', format: '## ### ## ##' },
  { name: 'Serbia', code: 'RS', dialCode: '+381', flag: '🇷🇸', format: '## ### ####' },
  { name: 'Seychelles', code: 'SC', dialCode: '+248', flag: '🇸🇨', format: '# ### ###' },
  { name: 'Sierra Leone', code: 'SL', dialCode: '+232', flag: '🇸🇱', format: '## ######' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', format: '#### ####' },
  { name: 'Slovakia', code: 'SK', dialCode: '+421', flag: '🇸🇰', format: '### ### ###' },
  { name: 'Slovenia', code: 'SI', dialCode: '+386', flag: '🇸🇮', format: '## ### ###' },
  { name: 'Somalia', code: 'SO', dialCode: '+252', flag: '🇸🇴', format: '# ### ###' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', format: '## ### ####' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', format: '## #### ####' },
  { name: 'South Sudan', code: 'SS', dialCode: '+211', flag: '🇸🇸', format: '## ### ####' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', format: '### ## ## ##' },
  { name: 'Sri Lanka', code: 'LK', dialCode: '+94', flag: '🇱🇰', format: '## ### ####' },
  { name: 'Sudan', code: 'SD', dialCode: '+249', flag: '🇸🇩', format: '## ### ####' },
  { name: 'Suriname', code: 'SR', dialCode: '+597', flag: '🇸🇷', format: '###-####' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', format: '## ### ## ##' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', format: '## ### ## ##' },
  { name: 'Syria', code: 'SY', dialCode: '+963', flag: '🇸🇾', format: '## ### ####' },

  // T
  { name: 'Taiwan', code: 'TW', dialCode: '+886', flag: '🇹🇼', format: '### ### ###' },
  { name: 'Tajikistan', code: 'TJ', dialCode: '+992', flag: '🇹🇯', format: '## ### ####' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿', format: '### ### ###' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', format: '## ### ####' },
  { name: 'Togo', code: 'TG', dialCode: '+228', flag: '🇹🇬', format: '## ## ## ##' },
  { name: 'Trinidad and Tobago', code: 'TT', dialCode: '+1868', flag: '🇹🇹', format: '### ####' },
  { name: 'Tunisia', code: 'TN', dialCode: '+216', flag: '🇹🇳', format: '## ### ###' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', format: '### ### ####' },
  { name: 'Turkmenistan', code: 'TM', dialCode: '+993', flag: '🇹🇲', format: '## ######' },

  // U
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', format: '### ######' },
  { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦', format: '## ### ####' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', format: '## ### ####' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', format: '#### ######' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾', format: '# ### ## ##' },
  { name: 'Uzbekistan', code: 'UZ', dialCode: '+998', flag: '🇺🇿', format: '## ### ## ##' },

  // V
  { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪', format: '###-#######' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', format: '### ### ###' },

  // Y & Z
  { name: 'Yemen', code: 'YE', dialCode: '+967', flag: '🇾🇪', format: '### ### ###' },
  { name: 'Zambia', code: 'ZM', dialCode: '+260', flag: '🇿🇲', format: '## ### ####' },
  { name: 'Zimbabwe', code: 'ZW', dialCode: '+263', flag: '🇿🇼', format: '## ### ####' }
];

export const getCountryByCode = (code: string): CountryCode | undefined => {
  return COUNTRY_CODES.find((c) => c.code.toLowerCase() === code.toLowerCase() || c.dialCode === code);
};
