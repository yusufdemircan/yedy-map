import {MenuItem} from "primeng/api";

export const mapEditTabMenuItem = [
    {label: 'Nokta', icon: 'pi pi-fw pi-map-marker', value: 'Point'},
    {label: 'Çizgi', icon: 'pi pi-fw pi-minus', value: 'LineString'},
    {label: 'Poligon', icon: 'pi pi-fw pi-cloud', value: 'Polygon'},
    {label: 'Daire', icon: 'pi pi-fw pi-circle', value: 'Circle'},
    {label: 'Gezinti', icon: 'pi pi-fw pi-globe', value: 'None'}
]

export const mapEditToolbarsItem = [
    {
        tooltipOptions: {
            tooltipLabel: 'Çizim',
            tooltipPosition: 'top'
        },
        icon: 'pi pi-pencil',
        label: 'Çizim',
        subItems: [
            {label: 'Nokta', icon: 'pi pi-fw pi-map-marker', value: 'Point'},
            {label: 'Çizgi', icon: 'pi pi-fw pi-minus', value: 'LineString'},
            {label: 'Poligon', icon: 'pi pi-fw pi-cloud', value: 'Polygon'},
            {label: 'Daire', icon: 'pi pi-fw pi-circle', value: 'Circle'},
            {label: 'Gezinti', icon: 'pi pi-fw pi-globe', value: 'None'}
        ]
    },
    {
        tooltipOptions: {
            tooltipLabel: 'Ölçüm',
            tooltipPosition: 'top'
        },
        icon: 'pi pi-arrows-h',
        label: 'Ölçüm',
        subItems: [
            {label: 'Çizgi', icon: 'pi pi-fw pi-minus', value: 'line'},
            {label: 'Alan', icon: 'pi pi-fw pi-cloud', value: 'area'},
        ]
    },
    {
        tooltipOptions: {
            tooltipLabel: 'Düzenleme'
        },
        label: 'Düzenleme',
        icon: 'pi pi-refresh',
    },
    {
        tooltipOptions: {
            tooltipLabel: 'Çizim',
            tooltipPosition: 'top'
        },
        label: 'Çıktı',
        icon: 'pi pi-print',
        subItems: [
            {label: 'PNG', icon: 'pi pi-fw pi-images', value: 'PNG'},
            {label: 'PDF', icon: 'pi pi-fw pi-file-pdf', value: 'PDF'},
            {label: 'KML', icon: 'pi pi-fw pi-file-export', value: 'KML'},
            ]
    },
];

export const mapSideBar = [
    {
        label: 'Germany', value: 'de',
        items: [
            {label: 'Berlin', value: 'Berlin'},
            {label: 'Frankfurt', value: 'Frankfurt'},
            {label: 'Hamburg', value: 'Hamburg'},
            {label: 'Munich', value: 'Munich'}
        ]
    },
    {
        label: 'USA', value: 'us',
        items: [
            {label: 'Chicago', value: 'Chicago'},
            {label: 'Los Angeles', value: 'Los Angeles'},
            {label: 'New York', value: 'New York'},
            {label: 'San Francisco', value: 'San Francisco'}
        ]
    },
    {
        label: 'Japan', value: 'jp',
        items: [
            {label: 'Kyoto', value: 'Kyoto'},
            {label: 'Osaka', value: 'Osaka'},
            {label: 'Tokyo', value: 'Tokyo'},
            {label: 'Yokohama', value: 'Yokohama'}
        ]
    }
];

export const mapTopbar = [
    {
        label: 'Options',
        items: [
            {
                label: 'Update',
                icon: 'pi pi-refresh',

            },
            {
                label: 'Delete',
                icon: 'pi pi-times',

            }
        ]
    },
    {
        label: 'Navigate',
        items: [
            {
                label: 'Angular',
                icon: 'pi pi-external-link',
                url: 'http://angular.io'
            },
            {
                label: 'Router',
                icon: 'pi pi-upload',
                routerLink: '/fileupload'
            }
        ]
    }
];
