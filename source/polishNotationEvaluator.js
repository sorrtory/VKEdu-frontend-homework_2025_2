/************************************************************************
 * @file              : Evaluate a Polish notation expression
 * @author            : Федуков Александр Web-22 <https://t.me/sorrtory>
 ************************************************************************/

'use strict';

/**
 * Custom error for division by zero
 */
class DivisionByZeroError extends Error {
    constructor(message = 'Division by zero') {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Evaluates a Polish notation expression.
 *
 * @param {string} str String to be evaluated.
 * @returns {number} Result of the evaluation or NaN if expression is bad.
 * @throws {Error} Throws error if the input is invalid or expression cannot be evaluated.
 */
const polishNotationEvaluator = str => {
    // Validate input to be non-empty string
    if (!(typeof str === 'string') && !(str instanceof String)) {
        throw new TypeError('Input must be a string');
    }
    if (str.trim().length === 0) {
        throw new TypeError('Input string must be non-empty');
    }

    // Split the expression into tokens, ignoring whitespace
    const stackResult = str.split(' ').reverse().reduce((stack, token) => {
        // Ignore empty tokens (multiple spaces of splitted string)
        if (token === '') {
            return stack;
        }

        // Iterate the expression in reverse order
        // On numeric tokens, push them on the stack
        // On operators, apply them to the last two elements of the stack
        if (!Number.isNaN(Number(token))) {
            stack.push(Number(token));
        } else {
            const a = stack.pop();
            const b = stack.pop();
            if (!a || !b) {
                throw new SyntaxError("Not enough operands given");
            }

            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    // Check for division by zero
                    if (b === 0) {
                        throw new DivisionByZeroError();
                    }
                    stack.push(a / b);
                    break;
                default:
                    // Unknown token
                    throw new SyntaxError(`Unknown token: ${token}`);
                }
            }
            return stack;
        }
    , []);

    // Check for remaining operands
    if (stackResult.length !== 1) {
        throw new SyntaxError('Too many values. Result cannot be calculated');
    }

    // Check for numeric result
    const numericResult = stackResult.pop();

    if (isNaN(numericResult)) {
        throw new SyntaxError('Result is not a number');
    }
    return numericResult;
};  