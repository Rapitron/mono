import { Api, HttpMethodTypes } from '@rapitron/api';
import { JsonFilters } from './json-filter';
import { upperCase } from 'lodash';
import * as moment from 'moment';

export default function () {
    return new Api({
        controllers: [
            {
                route: 'test',
                guards: [],
                handlers: [
                    {
                        method: HttpMethodTypes.ANY,
                        route: 'get',
                        guards: [],
                        parameters: [],
                        call: () => [0, 1, 2, upperCase('a'), moment.now()].filter(JsonFilters.not(JsonFilters.equals(1)))
                    }
                ]
            }
        ]
    });
}