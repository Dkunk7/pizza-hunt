const { Schema, model } = require(`mongoose`);
const dateFormat = require(`../utils/dateFormat`);

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String,
            required: true, // You could do this instead of "true" for a custom validation message: "You need to proved a pizza name!"
            trim: true
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            require: true, // If you want a custom error message with enum, you need to use Mongoose's 'validate' option.
            enum: [`Personal`, `Small`, `Medium`, `Large`, `Extra Large`],
            default: `Large`
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: `Comment`
            }
        ],
        toppings: []
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual(`commentCount`).get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model(`Pizza`, PizzaSchema);

// export the Pizza model
module.exports = Pizza;