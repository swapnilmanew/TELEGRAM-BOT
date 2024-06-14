const express = require("express");
const { Telegraf } = require("telegraf");
const mongoose = require('mongoose');
const Quotes = require("./model/quote_model");

const app = express();

// Mongoose Connection
mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.error("Error connecting to the database", err);
});

// Express route
app.get("/", async (req, res) => {
    try {
        const quotes = await Quotes.find({});
        return res.json(quotes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Telegraf bot
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

bot.start((context) => context.reply("🌟 Welcome to Quotes Bot! 🌟\n\nI'm here to inspire and uplift you with meaningful quotes. Type any of the following commands to get started:\n\n/life - Quotes about life\n/love - Quotes about love\n/motivation - Quotes to motivate you\n/friendship - Quotes about friendship\n/success - Quotes about success\n/happiness - Quotes about happiness\n/inspiration - Quotes to inspire you\n\nLet's embark on a journey of inspiration together! ✨"));

const sendQuote = async (category, context) => {
    try {
        const quote = await Quotes.aggregate([
            { $match: { category } },
            { $sample: { size: 1 } }
        ]);
        const quoteData = quote[0];
        context.reply(`${quoteData.quote}\n- ${quoteData.author}`);
    } catch (error) {
        console.error("Error sending quote:", error);
        context.reply("We encountered some difficulties! 🥲");
    }
};

const handleCommand = async (command, context) => {
    await sendQuote(command, context);
}

const commands = ["life", "love", "motivation", "friendship", "success", "happiness", "inspiration", "positivity", "strength"];
commands.forEach(command => {
    bot.command(command, async (context) => handleCommand(command, context));
});

bot.help((context) => context.reply("Please contact for help!"));

// Start polling
bot.launch();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Express server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`);
});
