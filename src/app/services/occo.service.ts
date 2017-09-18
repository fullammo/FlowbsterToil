import { OccopusDescriptor } from 'app/editor/models/occopusDescriptor';
import { DescriptorService } from './../editor/shared/descriptor.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class OccoService {

  url: string;

  constructor(private http: HttpClient, descriptorSVC: DescriptorService) {
    this.url = '127.0.0.1/5000/infrastructures'; // provide a URL that has an occopus running on it.
  }

  buildWorkflow(descriptor: OccopusDescriptor) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-yaml');

    return this.http.post(this.url, descriptor, { headers: header }).subscribe(
      (res) => {
        console.log(res);
        return this;
      },
      (error) => {
        console.log('error occured', error);
      },
      () => {

      });
  }

  destroyWorkflow() {
    return this.http.post(this.url, { responseType: 'text' }).subscribe(
      (res) => {
        console.log(res);
        return this;
      },
      (error) => {
        console.log('error occured', error);
      },
      () => {

      });
  }
}
