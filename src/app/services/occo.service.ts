import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class OccoService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = 'http://192.168.154.27:5000/infrastructures/'; // provide a URL that has an occopus running on it.
  }

  buildWorkflow(yamldescriptor: string) {
    const header = new HttpHeaders();
    console.log(yamldescriptor);
    header.append('Content-Type', 'application/x-yaml');
    header.append('Access-Control-Allow-Headers', 'Content-Type');
    header.append('Access-Control-Allow-Methods', 'POST');
    header.append('Access-Control-Allow-Origin', '*');

    return this.http.post(this.url, yamldescriptor, { headers: header }).subscribe(
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
