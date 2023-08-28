import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../model/image';

@Injectable()
export class PhotoService {

    constructor(private http: HttpClient) { }

    getImages() {
        return this.http.get<any>('assets/fw/data/photos.json')
            .toPromise()
            .then(res => res.data as Image[])
            .then(data => data);
    }
}
