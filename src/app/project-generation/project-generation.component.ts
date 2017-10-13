import { Component, OnInit, ViewChild } from '@angular/core';

import { ProjectGenerationService } from './project-generation.service';

@Component({
    selector: 'project-generation',
    templateUrl: './project-generation.component.html',
    styleUrls: ['./project-generation.component.scss'],
    providers: [ProjectGenerationService]
})

export class ProjectGenerationComponent implements OnInit {
    @ViewChild('compinfo') compinfo : any;
    public header: string = 'Generate your project stack';
    public showDetail: boolean = false;
    public componentAnalysis: any;
    public compConfig: any;
    public stack: any = {
        project: {
            options: {}
        },
        dependencies: []
    };
    public manifests: Array<string> = [];
    public currentFrameworks: Array<any> = [];
    public currentVersions: Array<any> = [];
    public frameworkStructure: any;
    public pickedSuggestions: Array<any> = [];
    
    public packs: any = {
        maven: {
            name: 'maven',
            displayName: 'Maven',
            options: [{
                name: 'group',
                displayName: 'Group',
                placeholder: 'com.example.project'
            }, {
                name: 'artifactId',
                displayName: 'Artifact Id',
                placeholder: 'commons-example'
            }, {
                name: 'version',
                displayName: 'Project Version',
                placeholder: '1.0.0'
            }],
            frameworks: [{
                name: 'springboot',
                displayName: 'Spring Boot',
                versions: ['1.2.3']
            }, {
                name: 'vertx',
                displayName: 'Vert.x',
                versions: ['1.2.4']
            }, {
                name: 'wildfly',
                displayName: 'Wild Fly',
                versions: ['1.2.5']
            }]
        },
        node: {
            name: 'node',
            displayName: 'Node',
            frameworks: []
        },
        python: {
            name: 'python',
            displayName: 'Python',
            frameworks: [{
                name: 'django',
                displayName: 'Django',
                versions: ['1.2.3']
            }]
        }
    };

    constructor(private projectGenerationService: ProjectGenerationService) {}

    public onManifestChange(): void {
        console.log(this.stack.ecosystem);
        this.currentFrameworks = this.packs[this.stack.ecosystem].frameworks;
        if (this.currentFrameworks && this.currentFrameworks.length > 0) {
            this.stack['framework'] = this.currentFrameworks[0].name;
            this.onFrameworkChange();
        } else {
            this.currentVersions = [];
        }
    }

    public onFrameworkChange(): void {
        console.log(this.stack.framework);
        this.frameworkStructure = this.currentFrameworks.filter(framework => framework.name === this.stack.framework);
        this.currentVersions = [];
        if (this.frameworkStructure) {
            this.currentVersions = this.frameworkStructure[0].versions;
            if (this.currentVersions && this.currentVersions.length > 0) {
                this.stack['version'] = this.currentVersions[0];
            }
        }
    }

    public onVersionChange(): void {
        console.log(this.stack.version);
    }

    ngOnInit(): void {
        this.manifests = Object.keys(this.packs);
        debugger;
        let manifest: string = this.manifests[0];
        this.stack['ecosystem'] = manifest;
        this.stack['framework'] = null;
        this.stack['version'] = null;
        this.onManifestChange();
        if (this.packs[manifest].frameworks && this.packs[manifest].frameworks.length > 0) {
            this.stack['framework'] = this.packs[manifest].frameworks[0].name;
            this.onFrameworkChange();
        }
    }

    public handleSearch(result: any): void {
        console.log(result);
        if (result) {
            let suggestion: string = result.suggestion;
            if (result.status === 'added') {
                this.pickedSuggestions.push(suggestion);
            } else if (result.status === 'removed') {
                let index: number = this.pickedSuggestions.indexOf(suggestion);
                if (index !== -1) {
                    this.pickedSuggestions.splice(index, 1);
                }
            }
        }
    }

    public handleAnalyze(result: any): void {
        console.log(result);
        this.showDetail = true;
        this.componentAnalysis = result.content;
        let ref: any = result.ref;
        this.compConfig = {
            offset: {
                top: ref.offsetTop + 30 + 'px',
                left: ref.offsetLeft + (ref.offsetWidth / 2) - 10 + 'px'
            }
        };
    }
    public closeHover(){
        this.showDetail = false;
    }

    public postJSON() {
        console.log(this.stack);
        this.pickedSuggestions.forEach(suggestion => {
            this.stack.dependencies.push(suggestion.name);
        });
        if (this.stack) {
            this    .projectGenerationService
                    .postJSON(this.stack)
                    .subscribe(response => {
                        console.log(response);
                    });
        }
    }
}
