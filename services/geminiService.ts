// Gemini API is currently disabled
// This service provides basic information without making API calls

export const askNGOAssistant = async (question: string) => {
  // Simulate a brief delay to make it feel more natural
  await new Promise(resolve => setTimeout(resolve, 500));

  const lowerQuestion = question.toLowerCase();

  // Basic keyword-based responses
  if (lowerQuestion.includes('donate') || lowerQuestion.includes('donation') || lowerQuestion.includes('give')) {
    return "Thank you for your interest in supporting Giving Without Limit! You can donate via:\n\n• Zelle: 3124793840\n• Online donation form on our website\n\nYour generosity helps us continue our mission of humanitarian aid. God bless you!";
  }

  if (lowerQuestion.includes('program') || lowerQuestion.includes('what do you do')) {
    return "Giving Without Limit operates several key programs:\n\n• Feeding Programs\n• Addiction Recovery Support\n• Widow Support\n• Education Support\n• Kids Club\n\nAll our programs are designed to help people living under $2/day. For more details, please contact us at bisowilly@yahoo.com.";
  }

  if (lowerQuestion.includes('contact') || lowerQuestion.includes('reach') || lowerQuestion.includes('email') || lowerQuestion.includes('phone')) {
    return "You can reach Giving Without Limit at:\n\n• Email: bisowilly@yahoo.com\n• Phone/Zelle: 3124793840\n\nWe operate in Chicago, USA and Nigeria. We'd love to hear from you!";
  }

  if (lowerQuestion.includes('mission') || lowerQuestion.includes('about') || lowerQuestion.includes('who are you')) {
    return "Giving Without Limit (Good Acts) is a Christian humanitarian NGO founded in 2016 by Deaconess Oladoyin Ogunleye.\n\nOur mission is to provide humanitarian aid for people living under $2/day, guided by Hebrews 13:16 and Galatians 6:9.\n\nWe operate in Chicago, USA and Nigeria, spreading kindness through various support programs.";
  }

  // Default response
  return "Thank you for your question! For detailed information about Giving Without Limit, please contact us at:\n\n• Email: bisowilly@yahoo.com\n• Phone: 3124793840\n\nOur team will be happy to assist you. God bless!";
};
