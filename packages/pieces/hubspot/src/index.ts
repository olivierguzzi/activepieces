import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { hubSpotListsAddContactAction } from './lib/actions/add-contact-to-list-action';
import { createHubspotContact } from './lib/actions/create-contact.action';
import { hubSpotContactsCreateOrUpdateAction } from './lib/actions/create-or-update-contact-action';
import { newTaskAdded } from './lib/triggers/new-task-added'

export const hubspotAuth = PieceAuth.OAuth2({
    displayName: 'Authentication',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    required: true,
    scope: [
        'crm.lists.read',
        'crm.lists.write',
        'crm.objects.contacts.read',
        'crm.objects.contacts.write',
    ],
});

export const hubspot = createPiece({
	displayName: "HubSpot",
	    minimumSupportedRelease: '0.5.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/hubspot.png',
	authors: ['khaledmashaly', 'MoShizzle'],
    auth: hubspotAuth,
	actions: [
		createHubspotContact,
		hubSpotContactsCreateOrUpdateAction,
		hubSpotListsAddContactAction,
	],
	triggers: [
        newTaskAdded
    ],
});
