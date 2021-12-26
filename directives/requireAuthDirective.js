const { SchemaDirectiveVisitor, AuthenticationError} = require("apollo-server");

class RequireAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const [,,ctx] = args;
      if (ctx.user) {
        const result = await resolve.apply(this, args);
        return result;
      }
      else {
        throw new AuthenticationError(
          "You must be signed in to view this resource."
        );
      }
    };
  }
}

module.exports = RequireAuthDirective;
