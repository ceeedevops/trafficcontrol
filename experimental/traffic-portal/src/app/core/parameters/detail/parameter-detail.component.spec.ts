/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ReplaySubject } from "rxjs";

import {ProfileService} from "src/app/api";
import { APITestingModule } from "src/app/api/testing";
import { ParameterDetailComponent } from "src/app/core/parameters/detail/parameter-detail.component";
import { NavigationService } from "src/app/shared/navigation/navigation.service";

describe("ParameterDetailComponent", () => {
	let component: ParameterDetailComponent;
	let fixture: ComponentFixture<ParameterDetailComponent>;
	let route: ActivatedRoute;
	let paramMap: jasmine.Spy;
	let service: ProfileService;

	const navSvc = jasmine.createSpyObj([],{headerHidden: new ReplaySubject<boolean>(), headerTitle: new ReplaySubject<string>()});
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ParameterDetailComponent ],
			imports: [ APITestingModule, RouterTestingModule, MatDialogModule ],
			providers: [ { provide: NavigationService, useValue: navSvc } ]
		})
			.compileComponents();

		route = TestBed.inject(ActivatedRoute);
		paramMap = spyOn(route.snapshot.paramMap, "get");
		paramMap.and.returnValue(null);
		service = TestBed.inject(ProfileService);
		fixture = TestBed.createComponent(ParameterDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
		expect(paramMap).toHaveBeenCalled();
	});

	it("new parameter", async () => {
		paramMap.and.returnValue("new");

		fixture = TestBed.createComponent(ParameterDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		await fixture.whenStable();
		expect(paramMap).toHaveBeenCalled();
		expect(component.parameter).not.toBeNull();
		expect(component.parameter.name).toBe("");
		expect(component.new).toBeTrue();
	});

	it("existing parameter", async () => {
		const id = 1;
		paramMap.and.returnValue(id);
		const parameter = await service.getParameters(id);
		fixture = TestBed.createComponent(ParameterDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		await fixture.whenStable();
		expect(paramMap).toHaveBeenCalled();
		expect(component.parameter).not.toBeNull();
		expect(component.parameter.name).toBe(parameter.name);
		expect(component.new).toBeFalse();

	});
});
