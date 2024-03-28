export const hideEmailCharacters = (email: string): string => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
        return email;
    }

    // Replace characters from index 1 to "@" with asterisks
    const hiddenCharacters = email.slice(1, atIndex).replace(/./g, '*');

    // Concatenate the first character, hidden characters, and the rest of the email
    return email.charAt(0) + hiddenCharacters + email.slice(atIndex);
}


export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}