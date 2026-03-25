/**
 * @fileOverview Defines custom error types for Firestore permission issues.
 */

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
{
  "operation": "${context.operation}",
  "path": "${context.path}"${context.requestResourceData ? `,
  "request": {
    "resource": {
      "data": ${JSON.stringify(context.requestResourceData, null, 2).split('\n').join('\n      ')}
    }
  }` : ''}
}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
