document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('creditCardForm')

	const errorMessages = {
		cardNumber: 'Please enter a valid card number (16 digits).',
		cardName: 'Please enter a valid name (letters only).',
		expirationMonth: 'Please enter a valid month (01-12).',
		expirationYear: 'Please enter a valid year (4 digits).',
		cvv: 'Please enter a valid 3-digit CVV code.',
		invalidExpiration: 'Expiration date cannot be earlier than the current date.',
	}

	const validators = {
		cardNumber: value => /^(\d{4}-?){3}\d{0,4}$/.test(value),
		cardName: value => /^[A-Za-z\s]+$/.test(value),
		expirationMonth: value => /^(0[1-9]|1[0-2])$/.test(value),
		expirationYear: value => /^\d{4}$/.test(value),
		cvv: value => /^\d{3}$/.test(value),
	}

	const showError = (input, message) => {
		const errorElement = input.nextElementSibling
		if (errorElement) {
			errorElement.textContent = message
			errorElement.classList.add('visible')
		}
	}

	const clearError = input => {
		const errorElement = input.nextElementSibling
		if (errorElement) {
			errorElement.textContent = ''
			errorElement.classList.remove('visible')
		}
	}

	const validateInput = (input, validator, errorMessage) => {
		if (!validator(input.value)) {
			showError(input, errorMessage)
			return false
		}
		clearError(input)
		return true
	}

	const formatCardNumber = value => {
		value = value.replace(/\D/g, '')
		if (value.length > 16) {
			value = value.slice(0, 16)
		}
		return value.replace(/(\d{4})(?=\d)/g, '$1-')
	}

	const cardNumberInput = document.getElementById('cardNumber')
	cardNumberInput.addEventListener('input', e => {
		e.target.value = formatCardNumber(e.target.value)
	})

	const validateExpirationDate = (month, year) => {
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		const currentMonth = currentDate.getMonth() + 1

		return year > currentYear || (year === currentYear && month >= currentMonth)
	}

	const validateForm = () => {
		let isValid = true

		isValid &= validateInput(cardNumberInput, validators.cardNumber, errorMessages.cardNumber)

		const cardNameInput = document.getElementById('cardName')
		isValid &= validateInput(cardNameInput, validators.cardName, errorMessages.cardName)

		const expirationMonthInput = document.getElementById('expirationMonth')
		const expirationYearInput = document.getElementById('expirationYear')
		const month = parseInt(expirationMonthInput.value)
		const year = parseInt(expirationYearInput.value)

		const isMonthValid = validateInput(expirationMonthInput, validators.expirationMonth, errorMessages.expirationMonth)
		const isYearValid = validateInput(expirationYearInput, validators.expirationYear, errorMessages.expirationYear)

		if (isMonthValid && isYearValid && !validateExpirationDate(month, year)) {
			showError(expirationMonthInput, errorMessages.invalidExpiration)
			isValid = false
		}

		const cvvInput = document.getElementById('cvv')
		isValid &= validateInput(cvvInput, validators.cvv, errorMessages.cvv)

		return isValid
	}

	form.addEventListener('submit', e => {
		e.preventDefault()
		Array.from(form.querySelectorAll('.credit-card-form__error')).forEach(clearError)

		if (validateForm()) {
			alert('Form submitted successfully!')
			form.reset()
		}
	})
})
