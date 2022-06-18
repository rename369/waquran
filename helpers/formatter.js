const phoneNumberFormatter = function(number) {
	// Menghilangkan karakter selain angka
	let formatted = number.replace(/\D/g, '');

	// Ganti angka 0 didepan dengan 62
	if (formatted.startsWith('0')) {
		formatted = '62' + formatted.substr(1);
	}

	// Format untuk kirim whatsapp API
	if (!formatted.endsWith('@c.us')) {
		formatted += '@c.us';
	}

	return formatted;
}

module.exports = {
	phoneNumberFormatter
}