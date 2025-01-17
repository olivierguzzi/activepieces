import { hubSpotListIdDropdown } from '../common/props';
import { hubSpotClient } from '../common/client';
import { createAction, Property } from '@activepieces/pieces-framework';
import { assertNotNullOrUndefined } from '@activepieces/pieces-common';
import { hubspotAuth } from '../../';

export const hubSpotListsAddContactAction = createAction({
  auth: hubspotAuth,
    name: 'add_contact_to_list',
    displayName: 'Add contact To List',
    description: 'Add contact to list',
    sampleData: {
      'updated': [12345],
      'discarded': [12345],
      'invalidVids': [12345],
      'invalidEmails': ['hello@example.com'],
    },
    props: {
      listId: hubSpotListIdDropdown,
      email: Property.ShortText({
        displayName: 'Email',
        description: 'Contact email',
        required: true,
      }),
    },

    async run(context) {
      const token = context.auth.access_token;
      const { listId, email } = context.propsValue;

      assertNotNullOrUndefined(token, 'token');
      assertNotNullOrUndefined(listId, 'list');
      assertNotNullOrUndefined(email, 'email');

      return await hubSpotClient.lists.addContact({
        token,
        listId,
        email,
      });
    },
});
